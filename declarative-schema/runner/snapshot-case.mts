import { cpSync, copyFileSync, lstatSync, mkdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { requireNoSchemaChanges } from "./assertions.mts";
import {
  logCommandResult,
  logStage,
  runSupabase,
  skippedCommand,
} from "./commands.mts";
import {
  captureGeneratedFiles,
  removeGeneratedSchema,
  removeMigrationSqlFiles,
  requirePathInside,
} from "./files.mts";
import { requiresFallback } from "./status.mts";
import type {
  CaseRunContext,
  CommandResult,
  GeneratedFile,
  ProjectResult,
  SnapshotCase,
} from "./types.mts";

export function runSnapshotCase(
  migrationCase: SnapshotCase,
  context: CaseRunContext,
): ProjectResult {
  const { config, runDirectory, caseIndex } = context;
  const sourceMigration = join(config.migrationsDirectory, migrationCase.fileName);
  const workProject = join(runDirectory, basename(migrationCase.name));
  const workMigrations = join(workProject, "supabase", "migrations");
  requirePathInside(runDirectory, workProject);
  requirePathInside(config.migrationsDirectory, sourceMigration);
  requirePathInside(workProject, workMigrations);
  const sourceMetadata = lstatSync(sourceMigration);
  if (!sourceMetadata.isFile() || sourceMetadata.isSymbolicLink()) {
    throw new Error(`Unsafe migration case: ${sourceMigration}`);
  }
  const migrationSql = readFileSync(sourceMigration, "utf8").trim();
  cpSync(config.runtimeTemplateDirectory, workProject, {
    recursive: true,
    errorOnExist: true,
  });
  mkdirSync(workMigrations);
  copyFileSync(sourceMigration, join(workMigrations, "20260101000000_case.sql"));

  let reset: CommandResult | undefined;
  if (caseIndex > 0) {
    logStage("reset shared database from current fixture migrations");
    reset = runSupabase(config, workProject, [
      "supabase",
      "db",
      "reset",
      "--local",
      "--no-seed",
      "--debug",
    ]);
    logCommandResult(reset);
  }

  logStage("generate declarative schema from migrations");
  const generateCommand = [
    "supabase",
    "db",
    "schema",
    "declarative",
    "generate",
    "--local",
    ...(caseIndex === 0 ? ["--reset"] : []),
    "--overwrite",
    "--debug",
  ];
  const generate =
    reset?.status === "ERROR"
      ? skippedCommand(
          `npx ${generateCommand.join(" ")}`,
          "Database reset failed, so declarative generation was skipped.",
        )
      : runSupabase(config, workProject, generateCommand);
  logCommandResult(generate);

  let legacyGenerate: CommandResult | undefined;
  let nextGeneratedFiles: GeneratedFile[] | undefined;
  let legacyGeneratedFiles: GeneratedFile[] | undefined;
  if (requiresFallback(generate)) {
    nextGeneratedFiles = captureGeneratedFiles(workProject);
    process.stdout.write(
      `    captured: ${nextGeneratedFiles.length} pg-delta next generated file(s)\n`,
    );
  }

  const syncCommand = ["supabase", "db", "schema", "declarative", "sync", "--debug"];
  const syncVerificationCommand = [...syncCommand.slice(0, -1), "--no-apply", "--debug"];
  let sync = skippedCommand(
    `npx ${syncCommand.join(" ")}`,
    "Generate failed, so declarative sync was skipped.",
  );
  let migrationRemovalError: string | undefined;
  if (generate.status === "OK" || generate.status === "WARNING") {
    logStage("remove migration SQL from working copy");
    try {
      const removedMigrationCount = removeMigrationSqlFiles(workProject);
      process.stdout.write(`    result: OK (${removedMigrationCount} file(s) removed)\n`);
    } catch (error) {
      migrationRemovalError = error instanceof Error ? error.message : String(error);
      process.stdout.write(`    result: ERROR (${migrationRemovalError})\n`);
    }

    logStage("sync migration from declarative schema with pg-delta next");
    sync = runSupabase(config, workProject, syncCommand);
    if (migrationRemovalError) {
      sync.output = [`Migration cleanup failed before sync: ${migrationRemovalError}`, sync.output]
        .filter(Boolean)
        .join("\n");
      sync.status = "ERROR";
    }
    logCommandResult(sync);
  } else {
    logStage("sync migration from declarative schema with pg-delta next");
    logCommandResult(sync);
  }

  let legacySync: CommandResult | undefined;
  let legacySyncVerification: CommandResult | undefined;
  let syncVerification: CommandResult | undefined;
  if (sync.status !== "ERROR") {
    logStage("verify declarative schema has no remaining changes");
    syncVerification = requireNoSchemaChanges(
      runSupabase(config, workProject, syncVerificationCommand),
    );
    logCommandResult(syncVerification);
  }

  if (generate.status === "WARNING" || generate.status === "ERROR") {
    removeGeneratedSchema(workProject);
    logStage("retry generate with pg-delta legacy");
    const legacyGenerateCommand = generateCommand.filter((argument) => argument !== "--reset");
    legacyGenerate = runSupabase(config, workProject, legacyGenerateCommand, "legacy");
    logCommandResult(legacyGenerate);
    legacyGeneratedFiles = captureGeneratedFiles(workProject);
    process.stdout.write(
      `    captured: ${legacyGeneratedFiles.length} legacy generated file(s)\n`,
    );
  }

  if (generate.status === "WARNING") {
    logStage("sync migration from declarative schema with pg-delta legacy");
    legacySync = runSupabase(config, workProject, syncCommand, "legacy");
    logCommandResult(legacySync);
    if (legacySync.status !== "ERROR") {
      logStage("verify legacy declarative schema has no remaining changes");
      legacySyncVerification = requireNoSchemaChanges(
        runSupabase(config, workProject, syncVerificationCommand, "legacy"),
      );
      logCommandResult(legacySyncVerification);
    }
  }

  return {
    kind: "snapshot",
    name: migrationCase.name,
    migrationSql,
    reset,
    generate,
    nextGeneratedFiles,
    legacyGenerate,
    legacyGeneratedFiles,
    sync,
    syncVerification,
    legacySync,
    legacySyncVerification,
  };
}
