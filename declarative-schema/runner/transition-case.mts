import { cpSync, copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import {
  assertRenameAmbiguityHandledSafely,
  requireUnchangedDatabaseState,
} from "./assertions.mts";
import {
  logCommandResult,
  logStage,
  runDatabaseQuery,
  runSupabase,
  skippedCommand,
} from "./commands.mts";
import { captureMigrationFiles, requirePathInside } from "./files.mts";
import type {
  CaseRunContext,
  CommandResult,
  GeneratedFile,
  ProjectResult,
  RenameAmbiguityTransition,
} from "./types.mts";

export function runRenameAmbiguityTransition(
  testCase: RenameAmbiguityTransition,
  context: CaseRunContext,
): ProjectResult {
  const { config, runDirectory } = context;
  const workProject = join(runDirectory, basename(testCase.name));
  const workMigrations = join(workProject, "supabase", "migrations");
  const workDatabase = join(workProject, "supabase", "database");
  const workDeclaration = join(workDatabase, "rename-ambiguity.sql");
  requirePathInside(runDirectory, workProject);
  requirePathInside(workProject, workMigrations);
  requirePathInside(workProject, workDatabase);
  requirePathInside(workDatabase, workDeclaration);

  const baselineSql = readFileSync(testCase.baselinePath, "utf8").trim();
  const desiredSql = readFileSync(testCase.desiredPath, "utf8").trim();
  const dataSetupSql = readFileSync(testCase.dataSetupPath, "utf8").trim();
  const verificationSql = readFileSync(testCase.verificationPath, "utf8").trim();
  cpSync(config.runtimeTemplateDirectory, workProject, {
    recursive: true,
    errorOnExist: true,
  });
  mkdirSync(workMigrations);
  mkdirSync(workDatabase);
  copyFileSync(testCase.baselinePath, workDeclaration);
  copyFileSync(testCase.extensionsPath, join(workDatabase, "extensions.sql"));

  logStage("start shared local runtime");
  const runtimeStart = runSupabase(config, workProject, ["supabase", "start", "--debug"]);
  logCommandResult(runtimeStart);

  logStage("clear local database before declarative baseline");
  const reset =
    runtimeStart.status === "OK"
      ? runSupabase(config, workProject, [
          "supabase",
          "db",
          "reset",
          "--local",
          "--no-seed",
          "--debug",
        ])
      : skippedCommand(
          "npx supabase db reset --local --no-seed --debug",
          "The local runtime failed to start, so the baseline reset was skipped.",
        );
  logCommandResult(reset);

  const baselineSyncCommand = [
    "supabase",
    "db",
    "schema",
    "declarative",
    "sync",
    "--apply",
    "--name",
    "rename_ambiguity_baseline",
    "--debug",
  ];
  logStage("establish state A through declarative sync --apply");
  const baselineSync =
    reset.status === "OK"
      ? runSupabase(config, workProject, baselineSyncCommand)
      : skippedCommand(
          `npx ${baselineSyncCommand.join(" ")}`,
          "The baseline reset failed, so the initial declarative sync was skipped.",
        );
  const transitionBaselineMigrationFiles =
    baselineSync.status === "OK" ? captureMigrationFiles(workProject) : [];
  if (baselineSync.status === "OK" && transitionBaselineMigrationFiles.length === 0) {
    baselineSync.output = [
      "The initial declarative sync did not generate a baseline migration.",
      baselineSync.output,
    ]
      .filter(Boolean)
      .join("\n");
    baselineSync.status = "ERROR";
  }
  logCommandResult(baselineSync);

  let dataSetup: CommandResult | undefined;
  let baselineState: CommandResult | undefined;
  let transitionMigrationFiles: GeneratedFile[] = [];
  let transitionRawSyncStatus: CommandResult["status"] | undefined;
  let transitionSafetySummary: string | undefined;
  const syncCommand = [
    "supabase",
    "db",
    "schema",
    "declarative",
    "sync",
    "--no-apply",
    "--debug",
  ];
  let sync = skippedCommand(
    `npx ${syncCommand.join(" ")}`,
    "The declarative baseline failed, so the rename transition was skipped.",
  );
  let syncVerification: CommandResult | undefined;

  if (baselineSync.status === "OK") {
    logStage("insert representative baseline data");
    dataSetup = runDatabaseQuery(config, workProject, dataSetupSql);
    logCommandResult(dataSetup);

    if (dataSetup.status === "OK") {
      logStage("capture baseline object identity and data");
      baselineState = runDatabaseQuery(config, workProject, verificationSql);
      logCommandResult(baselineState);
    }

    if (baselineState?.status === "OK") {
      logStage("update the declarative table name from state A to state B");
      copyFileSync(testCase.desiredPath, workDeclaration);
      process.stdout.write("    result: OK\n");

      logStage("generate transition without applying it");
      const rawSync = runSupabase(config, workProject, syncCommand);
      transitionRawSyncStatus = rawSync.status;
      transitionMigrationFiles = captureMigrationFiles(
        workProject,
        new Set(transitionBaselineMigrationFiles.map((file) => file.path)),
      );
      const safetyAssertion = assertRenameAmbiguityHandledSafely(
        rawSync,
        transitionMigrationFiles,
        testCase.sourceIdentifier,
      );
      sync = safetyAssertion.result;
      transitionSafetySummary = safetyAssertion.summary;
      logCommandResult(sync);

      logStage("verify baseline identity and data were preserved");
      syncVerification = requireUnchangedDatabaseState(
        baselineState,
        runDatabaseQuery(config, workProject, verificationSql),
      );
      logCommandResult(syncVerification);
    } else {
      sync = skippedCommand(
        `npx ${syncCommand.join(" ")}`,
        "Baseline data setup or state capture failed, so the transition was skipped.",
      );
      transitionSafetySummary = "The safety assertion could not run because baseline setup failed.";
      logStage("generate transition without applying it");
      logCommandResult(sync);
    }
  } else {
    transitionSafetySummary =
      "The safety assertion could not run because the declarative baseline failed.";
    logStage("generate transition without applying it");
    logCommandResult(sync);
  }

  return {
    kind: "transition",
    name: testCase.name,
    migrationSql: baselineSql,
    desiredSql,
    dataSetupSql,
    runtimeStart,
    reset,
    baselineSync,
    dataSetup,
    baselineState,
    sync,
    syncVerification,
    transitionRawSyncStatus,
    transitionSafetySummary,
    transitionBaselineMigrationFiles,
    transitionMigrationFiles,
  };
}
