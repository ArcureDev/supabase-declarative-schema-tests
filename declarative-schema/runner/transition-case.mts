import { cpSync, copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { basename, join, relative } from "node:path";
import {
  assertRenameAmbiguityHandledSafely,
  requireUnchangedDatabaseState,
} from "./assertions.mts";
import {
  runActionTask,
  runCommandTask,
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

export async function runRenameAmbiguityTransition(
  testCase: RenameAmbiguityTransition,
  context: CaseRunContext,
): Promise<ProjectResult> {
  const { config, runDirectory } = context;
  const workProject = join(runDirectory, basename(testCase.name));
  const workMigrations = join(workProject, "supabase", "migrations");
  const workDeclaration = join(
    workProject,
    relative(testCase.projectDirectory, testCase.baselinePath),
  );
  requirePathInside(runDirectory, workProject);
  requirePathInside(workProject, workMigrations);
  requirePathInside(workProject, workDeclaration);

  const baselineSql = readFileSync(testCase.baselinePath, "utf8").trim();
  const desiredSql = readFileSync(testCase.desiredPath, "utf8").trim();
  const dataSetupSql = readFileSync(testCase.dataSetupPath, "utf8").trim();
  const verificationSql = readFileSync(testCase.verificationPath, "utf8").trim();
  cpSync(testCase.projectDirectory, workProject, {
    recursive: true,
    errorOnExist: true,
  });
  mkdirSync(workMigrations, { recursive: true });

  const runtimeStart = await runCommandTask(config, "Start local Supabase", () =>
    runSupabase(config, workProject, ["supabase", "start", "--debug"]),
  );

  const reset = await runCommandTask(config, "Reset the database for baseline state A", () =>
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
        ),
  );

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
  const baselineSync = await runCommandTask(
    config,
    "Apply declarative baseline state A",
    async () => {
      const result =
        reset.status === "OK"
          ? await runSupabase(config, workProject, baselineSyncCommand)
          : skippedCommand(
              `npx ${baselineSyncCommand.join(" ")}`,
              "The baseline reset failed, so the initial declarative sync was skipped.",
            );
      const transitionBaselineMigrationFiles =
        result.status === "OK" ? captureMigrationFiles(workProject) : [];
      if (result.status === "OK" && transitionBaselineMigrationFiles.length === 0) {
        result.output = [
          "The initial declarative sync did not generate a baseline migration.",
          result.output,
        ]
          .filter(Boolean)
          .join("\n");
        result.status = "ERROR";
      }
      return result;
    },
  );
  const transitionBaselineMigrationFiles =
    baselineSync.status === "OK" ? captureMigrationFiles(workProject) : [];

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
    dataSetup = await runCommandTask(config, "Insert representative data into state A", () =>
      runDatabaseQuery(config, workProject, dataSetupSql),
    );

    if (dataSetup.status === "OK") {
      baselineState = await runCommandTask(
        config,
        "Capture state A table identity and data",
        () => runDatabaseQuery(config, workProject, verificationSql),
      );
    }

    if (baselineState?.status === "OK") {
      const declarationUpdate = await runActionTask(
        "Replace the state A declaration with desired state B",
        () => copyFileSync(testCase.desiredPath, workDeclaration),
      );
      if (declarationUpdate.status === "ERROR") {
        throw new Error(declarationUpdate.error);
      }

      sync = await runCommandTask(
        config,
        "Check ambiguous rename handling without applying changes",
        async () => {
          const rawSync = await runSupabase(config, workProject, syncCommand);
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
          transitionSafetySummary = safetyAssertion.summary;
          return safetyAssertion.result;
        },
        () => transitionSafetySummary,
      );

      const capturedBaselineState = baselineState;
      syncVerification = await runCommandTask(
        config,
        "Confirm state A identity and data are unchanged",
        async () =>
          requireUnchangedDatabaseState(
            capturedBaselineState,
            await runDatabaseQuery(config, workProject, verificationSql),
          ),
      );
    } else {
      sync = skippedCommand(
        `npx ${syncCommand.join(" ")}`,
        "Baseline data setup or state capture failed, so the transition was skipped.",
      );
      transitionSafetySummary = "The safety assertion could not run because baseline setup failed.";
      sync = await runCommandTask(
        config,
        "Check ambiguous rename handling without applying changes",
        () => sync,
      );
    }
  } else {
    transitionSafetySummary =
      "The safety assertion could not run because the declarative baseline failed.";
    sync = await runCommandTask(
      config,
      "Check ambiguous rename handling without applying changes",
      () => sync,
    );
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
