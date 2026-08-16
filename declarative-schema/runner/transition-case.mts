import { cpSync, copyFileSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import {
  assertApplicableMigrationSafe,
  assertDeterministicMigrationOutput,
  assertDependencyOrderingMigrationSafe,
  assertDestructiveColumnDropHandledSafely,
  assertExpectedNotNullFailure,
  assertExpectedUnsupported,
  assertGrantsRlsMigrationSafe,
  assertNoOpConverged,
  assertPopulatedColumnMigrationSafe,
  assertRecoveryMigrationSafe,
  assertRenameAmbiguityHandledSafely,
  requireDependencyOrderingStatePreserved,
  requireNoSchemaChanges,
  requirePopulatedColumnStatePreserved,
  requireRecoveryStateComplete,
  requireUnchangedDatabaseState,
  requireVerifiedStatePreserved,
} from "./assertions.mts";
import {
  runActionTask,
  runCommandTask,
  runDatabaseQuery,
  runSupabase,
  skippedCommand,
} from "./commands.mts";
import {
  captureMigrationFiles,
  removeCapturedMigrationFiles,
  requirePathInside,
} from "./files.mts";
import {
  materializePackDeclaration,
  readFixtureSql,
  workDeclarationPath,
} from "./scenario-pack-files.mts";
import type {
  ApplicableTransition,
  CaseRunContext,
  CommandResult,
  DeterministicOutputTransition,
  DependencyOrderingTransition,
  DestructiveChangeTransition,
  ExpectedUnsupportedTransition,
  GeneratedFile,
  GrantsRlsPreservationTransition,
  NoOpConvergenceTransition,
  PopulatedColumnTransition,
  ProjectResult,
  RecoveryAfterFailureTransition,
  RenameAmbiguityTransition,
  TransitionFixtureBase,
} from "./types.mts";

function transitionWorkProject(
  testCase: TransitionFixtureBase,
  context: CaseRunContext,
): string {
  const suffix = context.pgDeltaEngine === "legacy" ? "-legacy" : "";
  return join(context.runDirectory, `${basename(testCase.name)}${suffix}`);
}

function resolveWorkDeclaration(
  testCase: TransitionFixtureBase,
  workProject: string,
): string {
  return testCase.packScenarioId
    ? workDeclarationPath(testCase, workProject)
    : join(workProject, relative(testCase.projectDirectory, testCase.baselinePath));
}

function copyTransitionProject(
  testCase: TransitionFixtureBase,
  workProject: string,
): void {
  cpSync(testCase.projectDirectory, workProject, {
    recursive: true,
    errorOnExist: true,
  });
  if (testCase.packScenarioId) {
    materializePackDeclaration(testCase, workProject, testCase.baselinePath);
  }
}

function copyDesiredDeclaration(
  testCase: TransitionFixtureBase,
  workProject: string,
  workDeclaration: string,
): void {
  if (testCase.packScenarioId) {
    materializePackDeclaration(testCase, workProject, testCase.desiredPath);
    return;
  }
  copyFileSync(testCase.desiredPath, workDeclaration);
}

function packProvenance(testCase: TransitionFixtureBase): Pick<
  ProjectResult,
  "catalogueAtoms" | "packDirectory" | "packScenarioId" | "packDescription"
> {
  return {
    catalogueAtoms: testCase.catalogueAtoms,
    ...(testCase.packDirectory ? { packDirectory: testCase.packDirectory } : {}),
    ...(testCase.packScenarioId ? { packScenarioId: testCase.packScenarioId } : {}),
    ...(testCase.packDescription ? { packDescription: testCase.packDescription } : {}),
  };
}

function runTransitionSupabase(
  context: CaseRunContext,
  workProject: string,
  args: string[],
): Promise<CommandResult> {
  return runSupabase(
    context.config,
    workProject,
    args,
    context.pgDeltaEngine ?? "next",
  );
}

export async function runPlanningSafetyTransition(
  testCase: RenameAmbiguityTransition | DestructiveChangeTransition,
  context: CaseRunContext,
): Promise<ProjectResult> {
  const { config, runDirectory } = context;
  const isRenameAmbiguity = testCase.kind === "rename-ambiguity-transition";
  const transitionLabel = isRenameAmbiguity
    ? "rename ambiguity"
    : "destructive column drop";
  const planningTaskTitle = isRenameAmbiguity
    ? "Check ambiguous rename handling without applying changes"
    : "Check destructive column-drop handling without applying changes";
  const workProject = transitionWorkProject(testCase, context);
  const workMigrations = join(workProject, "supabase", "migrations");
  const workDeclaration = resolveWorkDeclaration(testCase, workProject);
  requirePathInside(runDirectory, workProject);
  requirePathInside(workProject, workMigrations);
  requirePathInside(workProject, workDeclaration);

  const baselineSql = readFixtureSql(testCase, testCase.baselinePath);
  const desiredSql = readFixtureSql(testCase, testCase.desiredPath);
  const dataSetupSql = readFixtureSql(testCase, testCase.dataSetupPath);
  const verificationSql = readFixtureSql(testCase, testCase.verificationPath);
  copyTransitionProject(testCase, workProject);
  mkdirSync(workMigrations, { recursive: true });

  const runtimeStart = await runCommandTask(config, "Start local Supabase", () =>
    runTransitionSupabase(context, workProject, ["supabase", "start", "--debug"]),
  );

  const reset = await runCommandTask(config, "Reset the database for baseline state A", () =>
    runtimeStart.status === "OK"
      ? runTransitionSupabase(context, workProject, [
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
    isRenameAmbiguity
      ? "rename_ambiguity_baseline"
      : "destructive_change_warning_baseline",
    "--debug",
  ];
  const baselineSync = await runCommandTask(
    config,
    "Apply declarative baseline state A",
    async () => {
      const result =
        reset.status === "OK"
          ? await runTransitionSupabase(context, workProject, baselineSyncCommand)
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
    `The declarative baseline failed, so the ${transitionLabel} transition was skipped.`,
  );
  let syncVerification: CommandResult | undefined;

  if (baselineSync.status === "OK") {
    dataSetup = await runCommandTask(config, "Insert representative data into state A", () =>
      runDatabaseQuery(config, workProject, dataSetupSql),
    );

    if (dataSetup.status === "OK") {
      baselineState = await runCommandTask(
        config,
        "Capture state A object identity and data",
        () => runDatabaseQuery(config, workProject, verificationSql),
      );
    }

    if (baselineState?.status === "OK") {
      const declarationUpdate = await runActionTask(
        "Replace the state A declaration with desired state B",
        () => copyDesiredDeclaration(testCase, workProject, workDeclaration),
      );
      if (declarationUpdate.status === "ERROR") {
        throw new Error(declarationUpdate.error);
      }

      sync = await runCommandTask(
        config,
        planningTaskTitle,
        async () => {
          const rawSync = await runTransitionSupabase(context, workProject, syncCommand);
          transitionRawSyncStatus = rawSync.status;
          transitionMigrationFiles = captureMigrationFiles(
            workProject,
            new Set(transitionBaselineMigrationFiles.map((file) => file.path)),
          );
          const safetyAssertion = isRenameAmbiguity
            ? assertRenameAmbiguityHandledSafely(
                rawSync,
                transitionMigrationFiles,
                testCase.sourceIdentifier,
              )
            : assertDestructiveColumnDropHandledSafely(
                rawSync,
                transitionMigrationFiles,
                testCase.tableIdentifier,
                testCase.columnIdentifier,
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
        planningTaskTitle,
        () => sync,
      );
    }
  } else {
    transitionSafetySummary =
      "The safety assertion could not run because the declarative baseline failed.";
    sync = await runCommandTask(
      config,
      planningTaskTitle,
      () => sync,
    );
  }

  return {
    kind: "transition",
    name: testCase.name,
    migrationSql: baselineSql,
    desiredSql,
    dataSetupSql,
    sensitiveValues: testCase.sensitiveValues,
    ...packProvenance(testCase),
    runtimeStart,
    reset,
    baselineSync,
    dataSetup,
    baselineState,
    sync,
    syncVerification,
    syncVerificationTitle: "Verify unchanged state A after non-applied planning",
    transitionRawSyncStatus,
    transitionSafetySummary,
    transitionAssertionTitle: isRenameAmbiguity
      ? "Rename-ambiguity safety assertion"
      : "Destructive-column-drop safety assertion",
    transitionBaselineMigrationFiles,
    transitionMigrationFiles,
  };
}

export async function runExpectedUnsupportedTransition(
  testCase: ExpectedUnsupportedTransition,
  context: CaseRunContext,
): Promise<ProjectResult> {
  const { config, runDirectory } = context;
  const workProject = transitionWorkProject(testCase, context);
  const workMigrations = join(workProject, "supabase", "migrations");
  const workDeclaration = resolveWorkDeclaration(testCase, workProject);
  requirePathInside(runDirectory, workProject);
  requirePathInside(workProject, workMigrations);
  requirePathInside(workProject, workDeclaration);

  const baselineSql = readFixtureSql(testCase, testCase.baselinePath);
  const siblingDirectory = testCase.packScenarioId
    ? join(testCase.projectDirectory, "supabase", "database")
    : dirname(testCase.baselinePath);
  const siblingBaselineSql = readdirSync(siblingDirectory, {
    withFileTypes: true,
  })
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(".sql") &&
        entry.name !== (testCase.packScenarioId
          ? testCase.declarativeFile
          : basename(testCase.baselinePath)),
    )
    .sort((left, right) => {
      if (left.name === "extensions.sql") return -1;
      if (right.name === "extensions.sql") return 1;
      return left.name.localeCompare(right.name);
    })
    .map((entry) =>
      readFileSync(join(siblingDirectory, entry.name), "utf8").trim()
    );
  const bootstrapSql = [...siblingBaselineSql, baselineSql].filter(Boolean).join("\n\n");
  const desiredSql = readFixtureSql(testCase, testCase.desiredPath);
  const dataSetupSql = readFixtureSql(testCase, testCase.dataSetupPath);
  const baselineVerificationSql = readFixtureSql(
    testCase,
    testCase.baselineVerificationPath,
  );
  copyTransitionProject(testCase, workProject);
  mkdirSync(workMigrations, { recursive: true });

  const runtimeStart = await runCommandTask(config, "Start local Supabase", () =>
    runTransitionSupabase(context, workProject, ["supabase", "start", "--debug"]),
  );
  const reset = await runCommandTask(config, "Reset the database for baseline state A", () =>
    runtimeStart.status === "OK"
      ? runTransitionSupabase(context, workProject, [
          "supabase",
          "db",
          "reset",
          "--local",
          "--no-seed",
          "--debug",
        ])
      : skippedCommand(
          "npx supabase db reset --local --no-seed --debug",
          "The local runtime failed to start, so baseline bootstrap was skipped.",
        ),
  );
  const baselineSync = await runCommandTask(
    config,
    "Bootstrap unsupported baseline state A directly",
    () =>
      reset.status === "OK"
        ? runDatabaseQuery(config, workProject, bootstrapSql)
        : skippedCommand(
            "docker exec ... psql --file -",
            "The baseline reset failed, so direct bootstrap was skipped.",
          ),
  );

  let dataSetup: CommandResult | undefined;
  let baselineState: CommandResult | undefined;
  let transitionMigrationFiles: GeneratedFile[] = [];
  let transitionRawSyncStatus: CommandResult["status"] | undefined;
  let transitionSafetySummary: string | undefined;
  let syncVerification: CommandResult | undefined;
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
    "Baseline bootstrap failed, so unsupported-capability planning was skipped.",
  );

  if (baselineSync.status === "OK") {
    dataSetup = await runCommandTask(config, "Insert representative state A data", () =>
      runDatabaseQuery(config, workProject, dataSetupSql),
    );
    if (dataSetup.status === "OK") {
      baselineState = await runCommandTask(
        config,
        `Capture state A: ${testCase.description}`,
        () => runDatabaseQuery(config, workProject, baselineVerificationSql),
      );
    }
    if (baselineState?.status === "OK") {
      const declarationUpdate = await runActionTask(
        "Replace the state A declaration with desired state B",
        () => copyDesiredDeclaration(testCase, workProject, workDeclaration),
      );
      if (declarationUpdate.status === "ERROR") throw new Error(declarationUpdate.error);
      sync = await runCommandTask(
        config,
        `Require an unsupported-capability diagnostic: ${testCase.description}`,
        async () => {
          const rawSync = await runTransitionSupabase(context, workProject, syncCommand);
          transitionRawSyncStatus = rawSync.status;
          transitionMigrationFiles = captureMigrationFiles(workProject);
          const assertion = assertExpectedUnsupported(
            rawSync,
            transitionMigrationFiles,
            testCase.requiredDiagnosticPatterns,
            testCase.forbiddenDiagnosticPatterns,
            testCase.sensitiveValues,
          );
          transitionSafetySummary = assertion.summary;
          return assertion.result;
        },
        () => transitionSafetySummary,
      );
      const capturedBaselineState = baselineState;
      syncVerification = await runCommandTask(
        config,
        "Verify unsupported planning left state A unchanged",
        async () =>
          requireUnchangedDatabaseState(
            capturedBaselineState,
            await runDatabaseQuery(config, workProject, baselineVerificationSql),
          ),
      );
    }
  }

  return {
    kind: "transition",
    name: testCase.name,
    migrationSql: baselineSql,
    desiredSql,
    dataSetupSql,
    sensitiveValues: testCase.sensitiveValues,
    ...packProvenance(testCase),
    runtimeStart,
    reset,
    baselineSync,
    dataSetup,
    baselineState,
    sync,
    syncVerification,
    syncVerificationTitle: "Verify unchanged state after unsupported planning",
    transitionRawSyncStatus,
    transitionSafetySummary,
    transitionAssertionTitle: "Expected-unsupported diagnostic assertion",
    transitionBaselineMigrationFiles: [],
    transitionMigrationFiles,
  };
}

export async function runApplicableTransition(
  testCase:
    | PopulatedColumnTransition
    | DependencyOrderingTransition
    | GrantsRlsPreservationTransition
    | ApplicableTransition,
  context: CaseRunContext,
): Promise<ProjectResult> {
  const { config, runDirectory } = context;
  const isDependencyOrdering = testCase.kind === "dependency-ordering-transition";
  const isGrantsRls = testCase.kind === "grants-rls-preservation-transition";
  const isApplicable = testCase.kind === "applicable-transition";
  const transitionLabel = isDependencyOrdering
    ? "dependency-ordering"
    : isGrantsRls
      ? "grants/RLS-preservation"
      : isApplicable
        ? testCase.description
      : "populated-column";
  const syncTaskTitle = isDependencyOrdering
    ? "Generate and inspect the dependency-ordered migration"
    : isGrantsRls
      ? "Generate and inspect the grants/RLS-preserving migration"
      : isApplicable
        ? `Generate and inspect: ${testCase.description}`
      : "Generate and inspect the populated-column migration";
  const applyTaskTitle = isDependencyOrdering
    ? "Apply the generated dependency-ordered migration"
    : isGrantsRls
      ? "Apply the generated grants/RLS-preserving migration"
      : isApplicable
        ? `Apply the generated migration: ${testCase.description}`
      : "Apply the generated populated-column migration";
  const verificationTaskTitle = isDependencyOrdering
    ? "Verify source identity, dependencies, data, and view behavior"
    : isGrantsRls
      ? "Verify grants, RLS, policy, identity, and populated data"
      : isApplicable
        ? `Verify desired state: ${testCase.description}`
      : "Verify table identity, populated rows, and new defaults";
  const workProject = transitionWorkProject(testCase, context);
  const workMigrations = join(workProject, "supabase", "migrations");
  const workDeclaration = resolveWorkDeclaration(testCase, workProject);
  requirePathInside(runDirectory, workProject);
  requirePathInside(workProject, workMigrations);
  requirePathInside(workProject, workDeclaration);

  const baselineSql = readFixtureSql(testCase, testCase.baselinePath);
  const desiredSql = readFixtureSql(testCase, testCase.desiredPath);
  const dataSetupSql = readFixtureSql(testCase, testCase.dataSetupPath);
  const baselineVerificationSql = readFixtureSql(
    testCase,
    testCase.baselineVerificationPath,
  );
  const verificationSql = readFixtureSql(testCase, testCase.verificationPath);
  copyTransitionProject(testCase, workProject);
  mkdirSync(workMigrations, { recursive: true });

  const runtimeStart = await runCommandTask(config, "Start local Supabase", () =>
    runTransitionSupabase(context, workProject, ["supabase", "start", "--debug"]),
  );
  const reset = await runCommandTask(config, "Reset the database for baseline state A", () =>
    runtimeStart.status === "OK"
      ? runTransitionSupabase(context, workProject, [
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
    isDependencyOrdering
      ? "dependency_ordering_baseline"
      : isGrantsRls
        ? "grants_rls_preservation_baseline"
        : isApplicable
          ? `${testCase.name.replace(/[^a-z0-9]+/gi, "_")}_baseline`
        : "populated_column_changes_baseline",
    "--debug",
  ];
  const baselineSync = await runCommandTask(
    config,
    "Apply declarative baseline state A",
    async () => {
      const result =
        reset.status === "OK"
          ? await runTransitionSupabase(context, workProject, baselineSyncCommand)
          : skippedCommand(
              `npx ${baselineSyncCommand.join(" ")}`,
              "The baseline reset failed, so the initial declarative sync was skipped.",
            );
      const generatedFiles = result.status === "OK" ? captureMigrationFiles(workProject) : [];
      if (result.status === "OK" && generatedFiles.length === 0) {
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
  let transitionApply: CommandResult | undefined;
  let transitionVerification: CommandResult | undefined;
  let syncVerification: CommandResult | undefined;
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
    `The declarative baseline failed, so the ${transitionLabel} transition was skipped.`,
  );

  if (baselineSync.status === "OK") {
    dataSetup = await runCommandTask(config, "Insert representative data into state A", () =>
      runDatabaseQuery(config, workProject, dataSetupSql),
    );
    if (dataSetup.status === "OK") {
      baselineState = await runCommandTask(
        config,
        isDependencyOrdering
          ? "Capture state A source-table identity and populated data"
          : isGrantsRls
            ? "Capture state A grants, RLS, policy, identity, and data"
            : isApplicable
              ? `Capture state A: ${testCase.description}`
            : "Capture state A table identity and populated data",
        () => runDatabaseQuery(config, workProject, baselineVerificationSql),
      );
    }

    if (baselineState?.status === "OK") {
      const declarationUpdate = await runActionTask(
        "Replace the state A declaration with desired state B",
        () => copyDesiredDeclaration(testCase, workProject, workDeclaration),
      );
      if (declarationUpdate.status === "ERROR") {
        throw new Error(declarationUpdate.error);
      }

      sync = await runCommandTask(
        config,
        syncTaskTitle,
        async () => {
          const rawSync = await runTransitionSupabase(context, workProject, syncCommand);
          transitionRawSyncStatus = rawSync.status;
          transitionMigrationFiles = captureMigrationFiles(
            workProject,
            new Set(transitionBaselineMigrationFiles.map((file) => file.path)),
          );
          const safetyAssertion =
            testCase.kind === "dependency-ordering-transition"
              ? assertDependencyOrderingMigrationSafe(
                  rawSync,
                  transitionMigrationFiles,
                  testCase,
                )
              : testCase.kind === "grants-rls-preservation-transition"
                ? assertGrantsRlsMigrationSafe(rawSync, transitionMigrationFiles)
                : testCase.kind === "applicable-transition"
                  ? assertApplicableMigrationSafe(
                      rawSync,
                      transitionMigrationFiles,
                      testCase.requiredMigrationPatterns,
                      testCase.forbiddenMigrationPatterns,
                      testCase.sensitiveValues,
                    )
                  : assertPopulatedColumnMigrationSafe(
                      rawSync,
                      transitionMigrationFiles,
                      testCase.tableIdentifier,
                    );
          transitionSafetySummary = safetyAssertion.summary;
          return safetyAssertion.result;
        },
        () => transitionSafetySummary,
      );

      const applyCommand = ["supabase", "migration", "up", "--local", "--debug"];
      transitionApply = await runCommandTask(
        config,
        applyTaskTitle,
        () =>
          sync.status === "OK"
            ? runTransitionSupabase(context, workProject, applyCommand)
            : skippedCommand(
                `npx ${applyCommand.join(" ")}`,
                "The generated migration failed its safety assertion, so it was not applied.",
              ),
      );

      const capturedBaselineState = baselineState;
      transitionVerification = await runCommandTask(
        config,
        verificationTaskTitle,
        async () =>
          transitionApply?.status === "OK"
            ? testCase.kind === "dependency-ordering-transition"
              ? requireDependencyOrderingStatePreserved(
                  capturedBaselineState,
                  await runDatabaseQuery(config, workProject, verificationSql),
                )
              : testCase.kind === "grants-rls-preservation-transition"
                ? requireVerifiedStatePreserved(
                    capturedBaselineState,
                    await runDatabaseQuery(config, workProject, verificationSql),
                    "Grants/RLS transition",
                  )
                : testCase.kind === "applicable-transition"
                  ? requireVerifiedStatePreserved(
                      capturedBaselineState,
                      await runDatabaseQuery(config, workProject, verificationSql),
                      testCase.description,
                    )
                  : requirePopulatedColumnStatePreserved(
                      capturedBaselineState,
                      await runDatabaseQuery(config, workProject, verificationSql),
                    )
            : skippedCommand(
                "docker exec ... psql --file -",
                "The transition migration was not applied, so desired state B was not verified.",
              ),
      );

      syncVerification = await runCommandTask(
        config,
        "Confirm desired state B has no remaining changes",
        async () =>
          transitionVerification?.status === "OK"
            ? requireNoSchemaChanges(
                await runTransitionSupabase(context, workProject, syncCommand),
              )
            : skippedCommand(
                `npx ${syncCommand.join(" ")}`,
                "Desired state B verification failed, so convergence was not checked.",
              ),
      );
    } else {
      transitionSafetySummary =
        "The safety assertion could not run because baseline setup or verification failed.";
      sync = await runCommandTask(
        config,
        syncTaskTitle,
        () => sync,
      );
    }
  } else {
    transitionSafetySummary =
      "The safety assertion could not run because the declarative baseline failed.";
    sync = await runCommandTask(
      config,
      syncTaskTitle,
      () => sync,
    );
  }

  return {
    kind: "transition",
    name: testCase.name,
    migrationSql: baselineSql,
    desiredSql,
    dataSetupSql,
    sensitiveValues: testCase.sensitiveValues,
    ...packProvenance(testCase),
    runtimeStart,
    reset,
    baselineSync,
    dataSetup,
    baselineState,
    sync,
    syncVerification,
    transitionRawSyncStatus,
    transitionSafetySummary,
    transitionAssertionTitle: isDependencyOrdering
      ? "Dependency-ordering migration assertion"
      : isGrantsRls
        ? "Grants/RLS preservation assertion"
        : isApplicable
          ? "Declared migration-shape assertion"
          : "Populated-column migration safety assertion",
    transitionBaselineMigrationFiles,
    transitionMigrationFiles,
    transitionApply,
    transitionVerification,
  };
}

type PreparedTransition = {
  workProject: string;
  workDeclaration: string;
  baselineSql: string;
  desiredSql: string;
  dataSetupSql: string;
  verificationSql: string;
  runtimeStart: CommandResult;
  reset: CommandResult;
  baselineSync: CommandResult;
  transitionBaselineMigrationFiles: GeneratedFile[];
};

async function prepareTransitionBaseline(
  testCase: TransitionFixtureBase,
  context: CaseRunContext,
  baselineName: string,
): Promise<PreparedTransition> {
  const { config, runDirectory } = context;
  const workProject = transitionWorkProject(testCase, context);
  const workMigrations = join(workProject, "supabase", "migrations");
  const workDeclaration = resolveWorkDeclaration(testCase, workProject);
  requirePathInside(runDirectory, workProject);
  requirePathInside(workProject, workMigrations);
  requirePathInside(workProject, workDeclaration);
  const baselineSql = readFixtureSql(testCase, testCase.baselinePath);
  const desiredSql = readFixtureSql(testCase, testCase.desiredPath);
  const dataSetupSql = readFixtureSql(testCase, testCase.dataSetupPath);
  const verificationSql = readFixtureSql(testCase, testCase.verificationPath);
  copyTransitionProject(testCase, workProject);
  mkdirSync(workMigrations, { recursive: true });

  const runtimeStart = await runCommandTask(config, "Start local Supabase", () =>
    runTransitionSupabase(context, workProject, ["supabase", "start", "--debug"]),
  );
  const reset = await runCommandTask(config, "Reset the database for baseline state A", () =>
    runtimeStart.status === "OK"
      ? runTransitionSupabase(context, workProject, [
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
    baselineName,
    "--debug",
  ];
  const baselineSync = await runCommandTask(
    config,
    "Apply declarative baseline state A",
    async () => {
      const result =
        reset.status === "OK"
          ? await runTransitionSupabase(context, workProject, baselineSyncCommand)
          : skippedCommand(
              `npx ${baselineSyncCommand.join(" ")}`,
              "The baseline reset failed, so the initial declarative sync was skipped.",
            );
      const generatedFiles = result.status === "OK" ? captureMigrationFiles(workProject) : [];
      if (result.status === "OK" && generatedFiles.length === 0) {
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
  return {
    workProject,
    workDeclaration,
    baselineSql,
    desiredSql,
    dataSetupSql,
    verificationSql,
    runtimeStart,
    reset,
    baselineSync,
    transitionBaselineMigrationFiles:
      baselineSync.status === "OK" ? captureMigrationFiles(workProject) : [],
  };
}

export async function runNoOpConvergenceTransition(
  testCase: NoOpConvergenceTransition,
  context: CaseRunContext,
): Promise<ProjectResult> {
  const prepared = await prepareTransitionBaseline(
    testCase,
    context,
    "no_op_convergence_baseline",
  );
  const { config } = context;
  const syncCommand = [
    "supabase",
    "db",
    "schema",
    "declarative",
    "sync",
    "--no-apply",
    "--debug",
  ];
  let dataSetup: CommandResult | undefined;
  let baselineState: CommandResult | undefined;
  let transitionMigrationFiles: GeneratedFile[] = [];
  let transitionRawSyncStatus: CommandResult["status"] | undefined;
  let transitionSafetySummary: string | undefined;
  let syncVerification: CommandResult | undefined;
  let sync = skippedCommand(
    `npx ${syncCommand.join(" ")}`,
    "The declarative baseline failed, so no-op convergence was skipped.",
  );

  if (prepared.baselineSync.status === "OK") {
    dataSetup = await runCommandTask(config, "Insert representative data into state A", () =>
      runDatabaseQuery(config, prepared.workProject, prepared.dataSetupSql),
    );
    if (dataSetup.status === "OK") {
      baselineState = await runCommandTask(
        config,
        "Capture state A identity, comment, and data",
        () => runDatabaseQuery(config, prepared.workProject, prepared.verificationSql),
      );
    }
    if (baselineState?.status === "OK") {
      const declarationUpdate = await runActionTask(
        "Replace state A with the identical desired declaration",
        () => copyDesiredDeclaration(testCase, prepared.workProject, prepared.workDeclaration),
      );
      if (declarationUpdate.status === "ERROR") throw new Error(declarationUpdate.error);
      sync = await runCommandTask(
        config,
        "Require an empty no-op diff",
        async () => {
          const rawSync = await runTransitionSupabase(
            context,
            prepared.workProject,
            syncCommand,
          );
          transitionRawSyncStatus = rawSync.status;
          transitionMigrationFiles = captureMigrationFiles(
            prepared.workProject,
            new Set(prepared.transitionBaselineMigrationFiles.map((file) => file.path)),
          );
          const assertion = assertNoOpConverged(rawSync, transitionMigrationFiles);
          transitionSafetySummary = assertion.summary;
          return assertion.result;
        },
        () => transitionSafetySummary,
      );
      const capturedBaselineState = baselineState;
      syncVerification = await runCommandTask(
        config,
        "Verify no-op planning left state A unchanged",
        async () =>
          requireUnchangedDatabaseState(
            capturedBaselineState,
            await runDatabaseQuery(config, prepared.workProject, prepared.verificationSql),
          ),
      );
    }
  }

  return {
    kind: "transition",
    name: testCase.name,
    migrationSql: prepared.baselineSql,
    desiredSql: prepared.desiredSql,
    dataSetupSql: prepared.dataSetupSql,
    sensitiveValues: testCase.sensitiveValues,
    ...packProvenance(testCase),
    runtimeStart: prepared.runtimeStart,
    reset: prepared.reset,
    baselineSync: prepared.baselineSync,
    dataSetup,
    baselineState,
    sync,
    syncVerification,
    syncVerificationTitle: "Verify unchanged state after no-op planning",
    transitionRawSyncStatus,
    transitionSafetySummary,
    transitionAssertionTitle: "No-op convergence assertion",
    transitionBaselineMigrationFiles: prepared.transitionBaselineMigrationFiles,
    transitionMigrationFiles,
  };
}

export async function runDeterministicOutputTransition(
  testCase: DeterministicOutputTransition,
  context: CaseRunContext,
): Promise<ProjectResult> {
  const prepared = await prepareTransitionBaseline(
    testCase,
    context,
    "deterministic_output_baseline",
  );
  const { config } = context;
  const syncCommand = [
    "supabase",
    "db",
    "schema",
    "declarative",
    "sync",
    "--no-apply",
    "--debug",
  ];
  let dataSetup: CommandResult | undefined;
  let baselineState: CommandResult | undefined;
  let transitionMigrationFiles: GeneratedFile[] = [];
  let transitionSecondMigrationFiles: GeneratedFile[] = [];
  let transitionRepeatSync: CommandResult | undefined;
  let syncVerification: CommandResult | undefined;
  let transitionRawSyncStatus: CommandResult["status"] | undefined;
  let transitionSafetySummary: string | undefined;
  let sync = skippedCommand(
    `npx ${syncCommand.join(" ")}`,
    "The declarative baseline failed, so deterministic generation was skipped.",
  );

  if (prepared.baselineSync.status === "OK") {
    dataSetup = await runCommandTask(config, "Insert representative data into state A", () =>
      runDatabaseQuery(config, prepared.workProject, prepared.dataSetupSql),
    );
    if (dataSetup.status === "OK") {
      baselineState = await runCommandTask(
        config,
        "Capture state A identity and data",
        () => runDatabaseQuery(config, prepared.workProject, prepared.verificationSql),
      );
    }
    if (baselineState?.status === "OK") {
      const declarationUpdate = await runActionTask(
        "Replace the state A declaration with desired state B",
        () => copyDesiredDeclaration(testCase, prepared.workProject, prepared.workDeclaration),
      );
      if (declarationUpdate.status === "ERROR") throw new Error(declarationUpdate.error);
      sync = await runCommandTask(
        config,
        "Generate the first deterministic migration",
        async () => {
          const result = await runTransitionSupabase(
            context,
            prepared.workProject,
            syncCommand,
          );
          transitionRawSyncStatus = result.status;
          transitionMigrationFiles = captureMigrationFiles(
            prepared.workProject,
            new Set(prepared.transitionBaselineMigrationFiles.map((file) => file.path)),
          );
          if (result.status === "OK" && transitionMigrationFiles.length === 0) {
            result.output = ["No first transition migration was generated.", result.output]
              .filter(Boolean)
              .join("\n");
            result.status = "ERROR";
          }
          return result;
        },
      );
      if (sync.status === "OK") {
        const removal = await runActionTask(
          "Remove the first generated migration before replay",
          () => removeCapturedMigrationFiles(prepared.workProject, transitionMigrationFiles),
          (count) => `${count} file(s) removed`,
        );
        if (removal.status === "ERROR") throw new Error(removal.error);
        transitionRepeatSync = await runCommandTask(
          config,
          "Generate and compare the second deterministic migration",
          async () => {
            const rawRepeat = await runTransitionSupabase(
              context,
              prepared.workProject,
              syncCommand,
            );
            transitionSecondMigrationFiles = captureMigrationFiles(
              prepared.workProject,
              new Set(prepared.transitionBaselineMigrationFiles.map((file) => file.path)),
            );
            const assertion = assertDeterministicMigrationOutput(
              sync,
              transitionMigrationFiles,
              rawRepeat,
              transitionSecondMigrationFiles,
            );
            transitionSafetySummary = assertion.summary;
            return assertion.result;
          },
          () => transitionSafetySummary,
        );
      }
      const capturedBaselineState = baselineState;
      syncVerification = await runCommandTask(
        config,
        "Verify repeated non-applied generation left state A unchanged",
        async () =>
          transitionRepeatSync?.status === "OK"
            ? requireUnchangedDatabaseState(
                capturedBaselineState,
                await runDatabaseQuery(config, prepared.workProject, prepared.verificationSql),
              )
            : skippedCommand(
                "docker exec ... psql --file -",
                "Deterministic comparison failed, so unchanged state was not verified.",
              ),
      );
    }
  }

  return {
    kind: "transition",
    name: testCase.name,
    migrationSql: prepared.baselineSql,
    desiredSql: prepared.desiredSql,
    dataSetupSql: prepared.dataSetupSql,
    sensitiveValues: testCase.sensitiveValues,
    ...packProvenance(testCase),
    runtimeStart: prepared.runtimeStart,
    reset: prepared.reset,
    baselineSync: prepared.baselineSync,
    dataSetup,
    baselineState,
    sync,
    syncVerification,
    syncVerificationTitle: "Verify unchanged state after repeated generation",
    transitionRawSyncStatus,
    transitionSafetySummary,
    transitionAssertionTitle: "Deterministic-output assertion",
    transitionBaselineMigrationFiles: prepared.transitionBaselineMigrationFiles,
    transitionMigrationFiles,
    transitionRepeatSync,
    transitionSecondMigrationFiles,
  };
}

export async function runRecoveryAfterFailureTransition(
  testCase: RecoveryAfterFailureTransition,
  context: CaseRunContext,
): Promise<ProjectResult> {
  const prepared = await prepareTransitionBaseline(
    testCase,
    context,
    "recovery_after_failure_baseline",
  );
  const { config } = context;
  const baselineVerificationSql = readFixtureSql(
    testCase,
    testCase.baselineVerificationPath,
  );
  const repairSql = readFixtureSql(testCase, testCase.repairPath);
  const syncCommand = [
    "supabase",
    "db",
    "schema",
    "declarative",
    "sync",
    "--no-apply",
    "--debug",
  ];
  const applyCommand = ["supabase", "migration", "up", "--local", "--debug"];
  let dataSetup: CommandResult | undefined;
  let baselineState: CommandResult | undefined;
  let transitionMigrationFiles: GeneratedFile[] = [];
  let transitionRawSyncStatus: CommandResult["status"] | undefined;
  let transitionSafetySummary: string | undefined;
  let transitionExpectedFailure: CommandResult | undefined;
  let transitionFailureRawStatus: CommandResult["status"] | undefined;
  let transitionFailureSummary: string | undefined;
  let transitionFailureVerification: CommandResult | undefined;
  let transitionRepair: CommandResult | undefined;
  let transitionRetry: CommandResult | undefined;
  let transitionVerification: CommandResult | undefined;
  let syncVerification: CommandResult | undefined;
  let sync = skippedCommand(
    `npx ${syncCommand.join(" ")}`,
    "The declarative baseline failed, so recovery testing was skipped.",
  );

  if (prepared.baselineSync.status === "OK") {
    dataSetup = await runCommandTask(config, "Insert valid and invalid state A rows", () =>
      runDatabaseQuery(config, prepared.workProject, prepared.dataSetupSql),
    );
    if (dataSetup.status === "OK") {
      baselineState = await runCommandTask(
        config,
        "Capture state A identity, nullability, and data",
        () => runDatabaseQuery(config, prepared.workProject, baselineVerificationSql),
      );
    }
    if (baselineState?.status === "OK") {
      const declarationUpdate = await runActionTask(
        "Replace the state A declaration with desired state B",
        () => copyDesiredDeclaration(testCase, prepared.workProject, prepared.workDeclaration),
      );
      if (declarationUpdate.status === "ERROR") throw new Error(declarationUpdate.error);
      sync = await runCommandTask(
        config,
        "Generate and inspect the recoverable migration",
        async () => {
          const rawSync = await runTransitionSupabase(
            context,
            prepared.workProject,
            syncCommand,
          );
          transitionRawSyncStatus = rawSync.status;
          transitionMigrationFiles = captureMigrationFiles(
            prepared.workProject,
            new Set(prepared.transitionBaselineMigrationFiles.map((file) => file.path)),
          );
          const assertion = assertRecoveryMigrationSafe(rawSync, transitionMigrationFiles);
          transitionSafetySummary = assertion.summary;
          return assertion.result;
        },
        () => transitionSafetySummary,
      );
      transitionExpectedFailure = await runCommandTask(
        config,
        "Require the first migration apply to fail on existing NULL data",
        async () => {
          const rawApply =
            sync.status === "OK"
              ? await runTransitionSupabase(context, prepared.workProject, applyCommand)
              : skippedCommand(
                  `npx ${applyCommand.join(" ")}`,
                  "Migration generation failed, so the expected apply failure was skipped.",
                );
          transitionFailureRawStatus = rawApply.status;
          const assertion = assertExpectedNotNullFailure(rawApply);
          transitionFailureSummary = assertion.summary;
          return assertion.result;
        },
        () => transitionFailureSummary,
      );
      const capturedBaselineState = baselineState;
      transitionFailureVerification = await runCommandTask(
        config,
        "Verify the failed migration rolled back cleanly",
        async () =>
          transitionExpectedFailure?.status === "OK"
            ? requireUnchangedDatabaseState(
                capturedBaselineState,
                await runDatabaseQuery(config, prepared.workProject, baselineVerificationSql),
              )
            : skippedCommand(
                "docker exec ... psql --file -",
                "The expected failure contract was not met, so rollback was not verified.",
              ),
      );
      transitionRepair = await runCommandTask(
        config,
        "Repair invalid data after the expected failure",
        () =>
          transitionFailureVerification?.status === "OK"
            ? runDatabaseQuery(config, prepared.workProject, repairSql)
            : skippedCommand(
                "docker exec ... psql --file -",
                "Rollback verification failed, so data repair was skipped.",
              ),
      );
      transitionRetry = await runCommandTask(
        config,
        "Retry the same generated migration",
        () =>
          transitionRepair?.status === "OK"
            ? runTransitionSupabase(context, prepared.workProject, applyCommand)
            : skippedCommand(
                `npx ${applyCommand.join(" ")}`,
                "Data repair failed, so migration retry was skipped.",
              ),
      );
      transitionVerification = await runCommandTask(
        config,
        "Verify recovered desired state B",
        async () =>
          transitionRetry?.status === "OK"
            ? requireRecoveryStateComplete(
                capturedBaselineState,
                await runDatabaseQuery(config, prepared.workProject, prepared.verificationSql),
              )
            : skippedCommand(
                "docker exec ... psql --file -",
                "Migration retry failed, so recovered state was not verified.",
              ),
      );
      syncVerification = await runCommandTask(
        config,
        "Confirm recovered state B has no remaining changes",
        async () =>
          transitionVerification?.status === "OK"
            ? requireNoSchemaChanges(
                await runTransitionSupabase(context, prepared.workProject, syncCommand),
              )
            : skippedCommand(
                `npx ${syncCommand.join(" ")}`,
                "Recovered-state verification failed, so convergence was not checked.",
              ),
      );
    }
  }

  return {
    kind: "transition",
    name: testCase.name,
    migrationSql: prepared.baselineSql,
    desiredSql: prepared.desiredSql,
    dataSetupSql: prepared.dataSetupSql,
    sensitiveValues: testCase.sensitiveValues,
    ...packProvenance(testCase),
    runtimeStart: prepared.runtimeStart,
    reset: prepared.reset,
    baselineSync: prepared.baselineSync,
    dataSetup,
    baselineState,
    sync,
    syncVerification,
    transitionRawSyncStatus,
    transitionSafetySummary,
    transitionAssertionTitle: "Recovery migration shape assertion",
    transitionBaselineMigrationFiles: prepared.transitionBaselineMigrationFiles,
    transitionMigrationFiles,
    transitionVerification,
    transitionExpectedFailure,
    transitionFailureRawStatus,
    transitionFailureSummary,
    transitionFailureVerification,
    transitionRepair,
    transitionRetry,
  };
}
