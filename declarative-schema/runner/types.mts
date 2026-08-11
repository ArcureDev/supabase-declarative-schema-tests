export type CaseSelection =
  | { kind: "all" }
  | { kind: "numbers"; caseNumbers: Set<number> }
  | { kind: "latest-failures" }
  | { kind: "latest-not-ok" };

export type SnapshotCase = {
  kind: "snapshot";
  fileName: string;
  name: string;
};

export type TransitionFixtureBase = {
  name: string;
  directory: string;
  projectDirectory: string;
  baselinePath: string;
  desiredPath: string;
  dataSetupPath: string;
  verificationPath: string;
  sensitiveValues: string[];
};

export type RenameAmbiguityTransition = TransitionFixtureBase & {
  kind: "rename-ambiguity-transition";
  sourceIdentifier: string;
};

export type DestructiveChangeTransition = TransitionFixtureBase & {
  kind: "destructive-change-transition";
  tableIdentifier: string;
  columnIdentifier: string;
};

export type PopulatedColumnTransition = TransitionFixtureBase & {
  kind: "populated-column-transition";
  baselineVerificationPath: string;
  tableIdentifier: string;
};

export type DependencyOrderingTransition = TransitionFixtureBase & {
  kind: "dependency-ordering-transition";
  baselineVerificationPath: string;
  tableIdentifier: string;
  functionIdentifier: string;
  baseViewIdentifier: string;
  leftViewIdentifier: string;
  rightViewIdentifier: string;
  leafViewIdentifier: string;
};

export type NoOpConvergenceTransition = TransitionFixtureBase & {
  kind: "no-op-convergence-transition";
};

export type GrantsRlsPreservationTransition = TransitionFixtureBase & {
  kind: "grants-rls-preservation-transition";
  baselineVerificationPath: string;
};

export type MigrationPatternAssertion = {
  description: string;
  pattern: string;
};

export type ApplicableTransition = TransitionFixtureBase & {
  kind: "applicable-transition";
  baselineVerificationPath: string;
  description: string;
  requiredMigrationPatterns: MigrationPatternAssertion[];
  forbiddenMigrationPatterns: MigrationPatternAssertion[];
};

export type ExpectedUnsupportedTransition = TransitionFixtureBase & {
  kind: "expected-unsupported-transition";
  baselineVerificationPath: string;
  description: string;
  requiredDiagnosticPatterns: MigrationPatternAssertion[];
  forbiddenDiagnosticPatterns: MigrationPatternAssertion[];
};

export type DeterministicOutputTransition = TransitionFixtureBase & {
  kind: "deterministic-output-transition";
};

export type RecoveryAfterFailureTransition = TransitionFixtureBase & {
  kind: "recovery-after-failure-transition";
  baselineVerificationPath: string;
  repairPath: string;
};

export type TransitionCase =
  | RenameAmbiguityTransition
  | DestructiveChangeTransition
  | PopulatedColumnTransition
  | DependencyOrderingTransition
  | NoOpConvergenceTransition
  | GrantsRlsPreservationTransition
  | ApplicableTransition
  | ExpectedUnsupportedTransition
  | DeterministicOutputTransition
  | RecoveryAfterFailureTransition;

export type TestCase = SnapshotCase | TransitionCase;

export type CommandStatus = "OK" | "WARNING" | "ERROR" | "SKIPPED";

export type CommandResult = {
  command: string;
  durationMilliseconds: number;
  exitCode: number | null;
  output: string;
  status: CommandStatus;
};

export type PgDeltaEngine = "next" | "legacy";

export type GeneratedFile = {
  path: string;
  content: string;
};

export type ProjectResult = {
  kind: "snapshot" | "transition";
  name: string;
  migrationSql: string;
  desiredSql?: string | undefined;
  dataSetupSql?: string | undefined;
  sensitiveValues?: string[] | undefined;
  runtimeStart?: CommandResult | undefined;
  reset?: CommandResult | undefined;
  baselineSync?: CommandResult | undefined;
  dataSetup?: CommandResult | undefined;
  baselineState?: CommandResult | undefined;
  generate?: CommandResult | undefined;
  nextGeneratedFiles?: GeneratedFile[] | undefined;
  legacyGenerate?: CommandResult | undefined;
  legacyGeneratedFiles?: GeneratedFile[] | undefined;
  sync: CommandResult;
  syncVerification?: CommandResult | undefined;
  syncVerificationTitle?: string | undefined;
  legacySync?: CommandResult | undefined;
  legacySyncVerification?: CommandResult | undefined;
  transitionRawSyncStatus?: CommandStatus | undefined;
  transitionSafetySummary?: string | undefined;
  transitionAssertionTitle?: string | undefined;
  transitionBaselineMigrationFiles?: GeneratedFile[] | undefined;
  transitionMigrationFiles?: GeneratedFile[] | undefined;
  transitionApply?: CommandResult | undefined;
  transitionVerification?: CommandResult | undefined;
  transitionRepeatSync?: CommandResult | undefined;
  transitionSecondMigrationFiles?: GeneratedFile[] | undefined;
  transitionExpectedFailure?: CommandResult | undefined;
  transitionFailureRawStatus?: CommandStatus | undefined;
  transitionFailureSummary?: string | undefined;
  transitionFailureVerification?: CommandResult | undefined;
  transitionRepair?: CommandResult | undefined;
  transitionRetry?: CommandResult | undefined;
  legacyTransition?: ProjectResult | undefined;
};

export type ProjectStatus = "OK" | "WARNING" | "FAILED";
export type LegacyProjectStatus = ProjectStatus | "NOT RUN";

export type DeclarativeEngine = "next" | "legacy";
export type DeclarativeCommand = "generate" | "sync" | "sync-verification";
export type VersionResultStatus = "OK" | "WARNING" | "ERROR";
export type DisplayedVersionStatus = VersionResultStatus | "—";

export type VersionResultRow = {
  caseName: string;
  command: DeclarativeCommand;
  nextStatus: DisplayedVersionStatus;
  legacyStatus: DisplayedVersionStatus;
  reportName: string;
};

export type ParsedVersionReport = {
  checksum: string;
  cliVersion: string;
  generated: string;
  reportName: string;
  caseResults: Map<string, Map<string, VersionResultStatus>>;
};

export type CaseSnapshot = {
  reportName: string;
  results: Map<string, VersionResultStatus>;
};

export type RunnerConfig = {
  scriptDirectory: string;
  repositoryDirectory: string;
  supabaseCliEntry: string;
  supabaseCliVersion: string;
  supabaseChecksum: string;
  migrationsDirectory: string;
  transitionsDirectory: string;
  runtimeTemplateDirectory: string;
  localDatabaseContainer: string;
  localWorkRoot: string;
  reportsDirectory: string;
  versionsDirectory: string;
  commandTimeoutMilliseconds: number;
  verbose: boolean;
};

export type CaseRunContext = {
  config: RunnerConfig;
  runDirectory: string;
  caseIndex: number;
  pgDeltaEngine?: PgDeltaEngine | undefined;
};
