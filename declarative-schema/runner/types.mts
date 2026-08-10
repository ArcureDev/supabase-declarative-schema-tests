export type CaseSelection =
  | { kind: "all" }
  | { kind: "numbers"; caseNumbers: Set<number> }
  | { kind: "latest-failures" };

export type SnapshotCase = {
  kind: "snapshot";
  fileName: string;
  name: string;
};

export type RenameAmbiguityTransition = {
  kind: "rename-ambiguity-transition";
  name: string;
  directory: string;
  baselinePath: string;
  desiredPath: string;
  extensionsPath: string;
  dataSetupPath: string;
  verificationPath: string;
  sourceIdentifier: string;
};

export type TestCase = SnapshotCase | RenameAmbiguityTransition;

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
  legacySync?: CommandResult | undefined;
  legacySyncVerification?: CommandResult | undefined;
  transitionRawSyncStatus?: CommandStatus | undefined;
  transitionSafetySummary?: string | undefined;
  transitionBaselineMigrationFiles?: GeneratedFile[] | undefined;
  transitionMigrationFiles?: GeneratedFile[] | undefined;
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
};
