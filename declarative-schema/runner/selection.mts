import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { listReportRelativePaths, reportSortKey } from "./reporting.mts";
import type { CaseSelection } from "./types.mts";

type VersionSelectionOption = "--not-ok" | "--not-done";

export function parseCaseSelection(args: string[]): CaseSelection {
  if (args.includes("--case")) {
    throw new Error("Missing case selection. Use --case=X, --case=X-Y, or --case=X,Y,Z.");
  }

  const caseArguments = args.filter((argument) => argument.startsWith("--case="));
  if (caseArguments.length > 1) {
    throw new Error("Specify --case only once.");
  }
  const failedArguments = args.filter(
    (argument) => argument === "--failed" || argument.startsWith("--failed="),
  );
  const notOkArguments = args.filter(
    (argument) => argument === "--not-ok" || argument.startsWith("--not-ok="),
  );
  const notDoneArguments = args.filter(
    (argument) => argument === "--not-done" || argument.startsWith("--not-done="),
  );
  if (failedArguments.some((argument) => argument !== "--failed")) {
    throw new Error("The --failed option does not accept a value.");
  }
  if (notOkArguments.some((argument) => argument !== "--not-ok")) {
    throw new Error("The --not-ok option does not accept a value.");
  }
  if (notDoneArguments.some((argument) => argument !== "--not-done")) {
    throw new Error("The --not-done option does not accept a value.");
  }
  if (failedArguments.length > 1) {
    throw new Error("Specify --failed only once.");
  }
  if (notOkArguments.length > 1) {
    throw new Error("Specify --not-ok only once.");
  }
  if (notDoneArguments.length > 1) {
    throw new Error("Specify --not-done only once.");
  }
  const selectionArgumentCount =
    Number(caseArguments.length > 0) +
    Number(failedArguments.length > 0) +
    Number(notOkArguments.length > 0) +
    Number(notDoneArguments.length > 0);
  if (selectionArgumentCount > 1) {
    throw new Error("Use only one of --case, --failed, --not-ok, or --not-done.");
  }
  if (failedArguments.length === 1) {
    return { kind: "latest-failures" };
  }
  if (notOkArguments.length === 1) {
    return { kind: "latest-not-ok" };
  }
  if (notDoneArguments.length === 1) {
    return { kind: "latest-not-done" };
  }
  const caseArgument = caseArguments[0];
  if (caseArgument === undefined) {
    return { kind: "all" };
  }

  const value = caseArgument.slice("--case=".length);
  const caseNumbers = new Set<number>();
  for (const part of value.split(",")) {
    const singleCaseMatch = /^(\d+)$/.exec(part);
    if (singleCaseMatch) {
      const caseNumber = Number(singleCaseMatch[1]);
      if (caseNumber < 1) {
        throw new Error(`Invalid case selection "${value}". Case numbers must be positive.`);
      }
      caseNumbers.add(caseNumber);
      continue;
    }

    const rangeMatch = /^(\d+)-(\d+)$/.exec(part);
    if (!rangeMatch) {
      throw new Error(
        `Invalid case selection "${value}". Use --case=18, --case=10-20, or --case=11,15,24.`,
      );
    }
    const firstCaseNumber = Number(rangeMatch[1]);
    const lastCaseNumber = Number(rangeMatch[2]);
    if (firstCaseNumber < 1 || lastCaseNumber < firstCaseNumber) {
      throw new Error(
        `Invalid case range "${part}". Ranges must contain positive numbers in ascending order.`,
      );
    }
    if (lastCaseNumber - firstCaseNumber > 10_000) {
      throw new Error(`Invalid case range "${part}". A range cannot contain over 10,001 cases.`);
    }
    for (let caseNumber = firstCaseNumber; caseNumber <= lastCaseNumber; caseNumber += 1) {
      caseNumbers.add(caseNumber);
    }
  }
  return { kind: "numbers", caseNumbers };
}

export function caseNumberFromName(caseName: string): number | undefined {
  const caseNumber = /^\d+/.exec(caseName)?.[0];
  return caseNumber === undefined ? undefined : Number(caseNumber);
}

export function compareCaseNames(left: string, right: string): number {
  const numberDifference = (caseNumberFromName(left) ?? 0) - (caseNumberFromName(right) ?? 0);
  return numberDifference === 0 ? left.localeCompare(right) : numberDifference;
}

export function latestReportPath(reportsDirectory: string): string {
  if (!existsSync(reportsDirectory)) {
    throw new Error("Cannot use --failed because no previous report exists.");
  }
  const reportRelativePath = listReportRelativePaths(reportsDirectory)
    .map((relativePath) => ({
      relativePath,
      sortKey: reportSortKey(relativePath),
    }))
    .sort(
      (left, right) =>
        right.sortKey.localeCompare(left.sortKey) ||
        right.relativePath.localeCompare(left.relativePath),
    )[0]?.relativePath;
  if (!reportRelativePath) {
    throw new Error("Cannot use --failed because no previous report exists.");
  }
  return join(reportsDirectory, ...reportRelativePath.split("/"));
}

export function latestVersionPath(
  versionsDirectory: string,
  checksum: string,
  optionName: VersionSelectionOption = "--not-ok",
): string {
  if (!existsSync(versionsDirectory)) {
    throw new Error(`Cannot use ${optionName} because no version report exists.`);
  }
  const canonicalVersionPath = join(versionsDirectory, `version-${checksum}.md`);
  if (existsSync(canonicalVersionPath)) return canonicalVersionPath;

  const datedVersionPattern = new RegExp(String.raw`^version-.+-${checksum}\.md$`);
  const versionFileName = readdirSync(versionsDirectory)
    .filter((fileName) => datedVersionPattern.test(fileName))
    .sort((left, right) => right.localeCompare(left))[0];
  if (!versionFileName) {
    throw new Error(
      `Cannot use ${optionName} because no version report exists for checksum ${checksum}.`,
    );
  }
  return join(versionsDirectory, versionFileName);
}

function prioritizedCaseNumbersFromVersion(
  versionFilePath: string,
  expectedCliVersion: string,
  expectedChecksum: string,
  availableCaseNames: string[],
  optionName: VersionSelectionOption,
): { caseNumber: number; priority: number; index: number }[] {
  const versionReport = readFileSync(versionFilePath, "utf8");
  const cliVersion = /^- Supabase CLI version: `([^`]+)`$/m.exec(versionReport)?.[1];
  const checksum = /^- Checksum: `([0-9a-f]{7})`$/im.exec(versionReport)?.[1];
  if (cliVersion !== expectedCliVersion || checksum !== expectedChecksum) {
    throw new Error(
      `Cannot use ${optionName} because ${versionFilePath} records CLI version ${cliVersion ?? "(missing)"} and checksum ${checksum ?? "(missing)"}, but the current CLI is version ${expectedCliVersion} with checksum ${expectedChecksum}.`,
    );
  }

  const requiredCommands = ["generate", "sync", "sync-verification"];
  const caseResults = new Map<string, { commands: Set<string>; priority: number }>();
  const rowPattern =
    /^\| `([^`]+)` \| (generate|sync|sync-verification) \| \*\*(OK|WARNING|ERROR|—)\*\* \| \*\*(OK|WARNING|ERROR|—)\*\* \|/gm;
  for (const row of versionReport.matchAll(rowPattern)) {
    const caseName = row[1];
    const command = row[2];
    const nextStatus = row[3];
    const legacyStatus = row[4];
    if (!caseName || !command || !nextStatus || !legacyStatus) continue;
    const result = caseResults.get(caseName) ?? {
      commands: new Set<string>(),
      priority: 3,
    };
    result.commands.add(command);
    const statuses = [nextStatus, legacyStatus];
    const rowPriority =
      statuses.every((status) => status === "—")
        ? 0
        : statuses.includes("ERROR")
          ? 1
          : statuses.includes("WARNING")
            ? 2
            : 3;
    result.priority = Math.min(result.priority, rowPriority);
    caseResults.set(caseName, result);
  }
  if (caseResults.size === 0) {
    throw new Error(
      `Cannot use ${optionName} because ${versionFilePath} has no version result rows.`,
    );
  }

  const prioritizedCaseNumbers: { caseNumber: number; priority: number; index: number }[] = [];
  for (const [index, caseName] of availableCaseNames.entries()) {
    const result = caseResults.get(caseName);
    const isComplete =
      result !== undefined && requiredCommands.every((command) => result.commands.has(command));
    const priority = isComplete ? result.priority : 0;
    const caseNumber = caseNumberFromName(caseName);
    if (caseNumber !== undefined) {
      prioritizedCaseNumbers.push({ caseNumber, priority, index });
    }
  }
  prioritizedCaseNumbers.sort(
    (left, right) => left.priority - right.priority || left.index - right.index,
  );
  return prioritizedCaseNumbers;
}

export function notOkCaseNumbersFromVersion(
  versionFilePath: string,
  expectedCliVersion: string,
  expectedChecksum: string,
  availableCaseNames: string[],
): Set<number> {
  return new Set(
    prioritizedCaseNumbersFromVersion(
      versionFilePath,
      expectedCliVersion,
      expectedChecksum,
      availableCaseNames,
      "--not-ok",
    )
      .filter(({ priority }) => priority < 3)
      .map(({ caseNumber }) => caseNumber),
  );
}

export function notDoneCaseNumbersFromVersion(
  versionFilePath: string,
  expectedCliVersion: string,
  expectedChecksum: string,
  availableCaseNames: string[],
): Set<number> {
  return new Set(
    prioritizedCaseNumbersFromVersion(
      versionFilePath,
      expectedCliVersion,
      expectedChecksum,
      availableCaseNames,
      "--not-done",
    )
      .filter(({ priority }) => priority === 0)
      .map(({ caseNumber }) => caseNumber),
  );
}

export function failedCaseNumbersFromReport(reportFilePath: string): Set<number> {
  const report = readFileSync(reportFilePath, "utf8");
  const failedCaseNumbers = new Set<number>();
  const resultMarkerPattern =
    /<!-- declarative-schema-case-result name="([^"]+)" status="(OK|WARNING|FAILED)" -->/g;
  const resultMarkers = [...report.matchAll(resultMarkerPattern)];

  if (resultMarkers.length > 0) {
    for (const marker of resultMarkers) {
      const caseName = marker[1];
      const status = marker[2];
      if (caseName !== undefined && status !== "OK") {
        const caseNumber = caseNumberFromName(caseName);
        if (caseNumber !== undefined) failedCaseNumbers.add(caseNumber);
      }
    }
    return failedCaseNumbers;
  }

  const caseSections = [...report.matchAll(/^## (.+)\r?\n([\s\S]*?)(?=^## |(?![\s\S]))/gm)];
  for (const section of caseSections) {
    const caseName = section[1];
    const sectionBody = section[2];
    if (caseName === undefined || sectionBody === undefined) continue;
    const caseNumber = caseNumberFromName(caseName);
    if (
      caseNumber !== undefined &&
      /- Result: \*\*(?:WARNING|ERROR|SKIPPED)\*\*/.test(sectionBody)
    ) {
      failedCaseNumbers.add(caseNumber);
    }
  }
  return failedCaseNumbers;
}
