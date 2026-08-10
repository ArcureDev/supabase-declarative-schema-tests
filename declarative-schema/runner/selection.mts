import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { CaseSelection } from "./types.mts";

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
  if (failedArguments.some((argument) => argument !== "--failed")) {
    throw new Error("The --failed option does not accept a value.");
  }
  if (failedArguments.length > 1) {
    throw new Error("Specify --failed only once.");
  }
  if (caseArguments.length > 0 && failedArguments.length > 0) {
    throw new Error("Use either --case or --failed, not both.");
  }
  if (failedArguments.length === 1) {
    return { kind: "latest-failures" };
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
  const reportFileName = readdirSync(reportsDirectory)
    .filter((fileName) => /^report-.*\.md$/.test(fileName))
    .sort((left, right) => right.localeCompare(left))[0];
  if (!reportFileName) {
    throw new Error("Cannot use --failed because no previous report exists.");
  }
  return join(reportsDirectory, reportFileName);
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
