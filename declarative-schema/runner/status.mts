import type {
  CommandResult,
  DisplayedVersionStatus,
  LegacyProjectStatus,
  ProjectResult,
  ProjectStatus,
  VersionResultStatus,
} from "./types.mts";

export function commandResultsStatus(commandResults: CommandResult[]): ProjectStatus {
  if (
    commandResults.some(
      (commandResult) => commandResult.status === "ERROR" || commandResult.status === "SKIPPED",
    )
  ) {
    return "FAILED";
  }
  return commandResults.some((commandResult) => commandResult.status === "WARNING")
    ? "WARNING"
    : "OK";
}

export function projectStatus(result: ProjectResult): ProjectStatus {
  return commandResultsStatus(
    [
      result.runtimeStart,
      result.reset,
      result.baselineSync,
      result.dataSetup,
      result.baselineState,
      result.generate,
      result.sync,
      result.syncVerification,
    ].filter((commandResult) => commandResult !== undefined),
  );
}

export function legacyProjectStatus(result: ProjectResult): LegacyProjectStatus {
  const commandResults = [
    result.legacyGenerate,
    result.legacySync,
    result.legacySyncVerification,
  ].filter((commandResult) => commandResult !== undefined);
  return commandResults.length === 0 ? "NOT RUN" : commandResultsStatus(commandResults);
}

export function projectFailed(result: ProjectResult): boolean {
  return projectStatus(result) !== "OK";
}

export function requiresFallback(result: CommandResult): boolean {
  return result.status === "WARNING" || result.status === "ERROR";
}

export function versionResultStatus(result: CommandResult): VersionResultStatus {
  return result.status === "SKIPPED" ? "ERROR" : result.status;
}

export function versionRowSeverity(
  nextStatus: DisplayedVersionStatus,
  legacyStatus: DisplayedVersionStatus,
): number {
  const statuses = [nextStatus, legacyStatus];
  if (statuses.every((status) => status === "—")) return 0;
  if (statuses.includes("ERROR")) return 1;
  if (statuses.includes("WARNING")) return 2;
  return 3;
}
