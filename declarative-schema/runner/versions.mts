import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import {
  caseReportRelativePath,
  isRunRecapRelativePath,
  listReportRelativePaths,
  reportDisplayName,
  reportRunKey,
  versionReportHref,
} from "./reporting.mts";
import { compareCaseNames } from "./selection.mts";
import { versionRowSeverity } from "./status.mts";
import type {
  CaseSnapshot,
  DeclarativeCommand,
  ParsedVersionReport,
  RunnerConfig,
  VersionResultRow,
  VersionResultStatus,
} from "./types.mts";

function reportAbsolutePath(reportsDirectory: string, reportRelativePath: string): string {
  return join(reportsDirectory, ...reportRelativePath.split("/"));
}

function parseMarkersFromText(report: string): {
  commandResults: Map<string, Map<string, VersionResultStatus>>;
  caseStatuses: Map<string, VersionResultStatus>;
} {
  const commandResults = new Map<string, Map<string, VersionResultStatus>>();
  const markerPattern =
    /<!-- declarative-schema-command-result case="([^"]+)" engine="(next|legacy)" command="(generate|sync|sync-verification)" status="(OK|WARNING|ERROR)" -->/g;
  for (const marker of report.matchAll(markerPattern)) {
    const caseName = marker[1];
    const engine = marker[2];
    const command = marker[3];
    const status = marker[4] as VersionResultStatus | undefined;
    if (!caseName || !engine || !command || !status) continue;
    const results = commandResults.get(caseName) ?? new Map<string, VersionResultStatus>();
    results.set(`${engine}:${command}`, status);
    commandResults.set(caseName, results);
  }

  const caseStatuses = new Map<string, VersionResultStatus>();
  const caseMarkerPattern =
    /<!-- declarative-schema-case-result name="([^"]+)" status="(OK|WARNING|FAILED)" -->/g;
  for (const marker of report.matchAll(caseMarkerPattern)) {
    const caseName = marker[1];
    const caseStatus = marker[2];
    if (!caseName || !caseStatus) continue;
    caseStatuses.set(
      caseName,
      caseStatus === "FAILED" ? "ERROR" : caseStatus === "WARNING" ? "WARNING" : "OK",
    );
  }
  return { commandResults, caseStatuses };
}

function caseNamesFromReportText(report: string): Set<string> {
  const names = new Set<string>();
  for (const marker of report.matchAll(
    /<!-- declarative-schema-case-result name="([^"]+)" status="(?:OK|WARNING|FAILED)" -->/g,
  )) {
    if (marker[1]) names.add(marker[1]);
  }
  for (const marker of report.matchAll(
    /<!-- declarative-schema-command-result case="([^"]+)" /g,
  )) {
    if (marker[1]) names.add(marker[1]);
  }
  for (const heading of report.matchAll(/^#{1,2} Case: (.+)$/gm)) {
    const value = heading[1]?.trimEnd();
    if (value) names.add(value);
  }
  return names;
}

export function parseVersionReport(
  reportsDirectory: string,
  reportRelativePath: string,
): ParsedVersionReport | undefined {
  const absolutePath = reportAbsolutePath(reportsDirectory, reportRelativePath);
  const report = readFileSync(absolutePath, "utf8");
  const checksum = /^- Checksum: `([0-9a-f]{7})`$/im.exec(report)?.[1];
  const cliVersion = /^- Supabase CLI version: `([^`]+)`$/m.exec(report)?.[1];
  const generated = /^- Generated: (.+)$/m.exec(report)?.[1];
  if (!checksum || !cliVersion || !generated) return undefined;

  const caseResults = new Map<string, Map<string, VersionResultStatus>>();
  const caseReportNames = new Map<string, string>();
  const { commandResults, caseStatuses } = parseMarkersFromText(report);
  for (const [caseName, results] of commandResults) {
    caseResults.set(caseName, results);
    caseReportNames.set(caseName, reportRelativePath);
  }

  if (isRunRecapRelativePath(reportRelativePath)) {
    const runDirectory = join(absolutePath, "..");
    for (const fileName of readdirSync(runDirectory)) {
      if (!fileName.endsWith(".md") || fileName === "0-recap.md") continue;
      const siblingRelativePath = reportRelativePath.replace(/0-recap\.md$/, fileName);
      const caseText = readFileSync(join(runDirectory, fileName), "utf8");
      const parsedCase = parseMarkersFromText(caseText);
      for (const [caseName, results] of parsedCase.commandResults) {
        const merged = caseResults.get(caseName) ?? new Map<string, VersionResultStatus>();
        for (const [key, status] of results) merged.set(key, status);
        caseResults.set(caseName, merged);
        caseReportNames.set(caseName, siblingRelativePath);
      }
      for (const caseName of caseNamesFromReportText(caseText)) {
        if (!caseReportNames.has(caseName)) {
          caseReportNames.set(caseName, siblingRelativePath);
        }
      }
    }
  }

  // Coverage (and any future) reports may only emit case-result markers. Fold
  // those into the version matrix so every evaluated case updates the checksum
  // file, even when generate/sync/sync-verification never ran.
  for (const [caseName, status] of caseStatuses) {
    if (caseResults.has(caseName)) continue;
    caseResults.set(
      caseName,
      new Map([
        ["next:generate", status],
        ["next:sync", status],
        ["next:sync-verification", status],
      ]),
    );
    if (!caseReportNames.has(caseName)) {
      caseReportNames.set(
        caseName,
        isRunRecapRelativePath(reportRelativePath)
          ? caseReportRelativePath(reportRelativePath, caseName)
          : reportRelativePath,
      );
    }
  }
  if (caseResults.size === 0) return undefined;
  const reportName = reportRelativePath.includes("/")
    ? reportRelativePath
    : `${checksum}/${reportRelativePath}`;
  return { checksum, cliVersion, generated, reportName, caseResults, caseReportNames };
}

function normalizeReportName(checksum: string, reportName: string): string {
  if (reportName.includes("/")) return reportName;
  return `${checksum}/${reportName}`;
}

function reportNamesMatch(left: string, right: string): boolean {
  if (left === right || left.endsWith(`/${right}`) || right.endsWith(`/${left}`)) return true;
  return reportRunKey(left) === reportRunKey(right);
}

function existingVersionSnapshots(config: RunnerConfig, checksum: string): Map<string, CaseSnapshot> {
  const snapshots = new Map<string, CaseSnapshot>();
  if (!existsSync(config.versionsDirectory)) return snapshots;

  const datedVersionPattern = new RegExp(String.raw`^version-.+-${checksum}\.md$`);
  const latestDatedVersion = readdirSync(config.versionsDirectory)
    .filter((versionName) => datedVersionPattern.test(versionName))
    .sort()
    .at(-1);
  const canonicalVersionName = `version-${checksum}.md`;
  const versionName =
    (existsSync(join(config.versionsDirectory, canonicalVersionName))
      ? canonicalVersionName
      : undefined) ?? latestDatedVersion;
  if (!versionName) return snapshots;

  const versionReport = readFileSync(join(config.versionsDirectory, versionName), "utf8");
  const rowPattern =
    /^\| `([^`]+)` \| (generate|sync|sync-verification) \| \*\*(OK|WARNING|ERROR|—)\*\* \| \*\*(OK|WARNING|ERROR|—)\*\* \| \[[^\]]+\]\(\.\.\/reports\/([^)#]+)/gm;
  for (const row of versionReport.matchAll(rowPattern)) {
    const caseName = row[1];
    const command = row[2];
    const nextStatus = row[3];
    const legacyStatus = row[4];
    const reportName = row[5];
    if (!caseName || !command || !nextStatus || !legacyStatus || !reportName) continue;
    const normalizedReportName = normalizeReportName(checksum, reportName);
    const snapshot = snapshots.get(caseName) ?? {
      reportName: normalizedReportName,
      results: new Map<string, VersionResultStatus>(),
    };
    snapshot.reportName = normalizedReportName;
    if (nextStatus !== "—") {
      snapshot.results.set(`next:${command}`, nextStatus as VersionResultStatus);
    }
    if (legacyStatus !== "—") {
      snapshot.results.set(`legacy:${command}`, legacyStatus as VersionResultStatus);
    }
    snapshots.set(caseName, snapshot);
  }

  const reportCandidates = listReportRelativePaths(config.reportsDirectory)
    .sort()
    .reverse()
    .map((reportRelativePath) => {
      const report = readFileSync(
        reportAbsolutePath(config.reportsDirectory, reportRelativePath),
        "utf8",
      );
      const reportChecksum = /^- Checksum: `([0-9a-f]{7})`$/im.exec(report)?.[1];
      const reportName = reportRelativePath.includes("/")
        ? reportRelativePath
        : reportChecksum
          ? `${reportChecksum}/${reportRelativePath}`
          : reportRelativePath;
      const caseNames = caseNamesFromReportText(report);
      if (isRunRecapRelativePath(reportRelativePath)) {
        const runDirectory = join(
          reportAbsolutePath(config.reportsDirectory, reportRelativePath),
          "..",
        );
        for (const fileName of readdirSync(runDirectory)) {
          if (!fileName.endsWith(".md") || fileName === "0-recap.md") continue;
          for (const caseName of caseNamesFromReportText(
            readFileSync(join(runDirectory, fileName), "utf8"),
          )) {
            caseNames.add(caseName);
          }
        }
      }
      return {
        reportName,
        checksum: reportChecksum,
        caseNames,
      };
    })
    .filter((report) => report.checksum === undefined || report.checksum === checksum);
  for (const [caseName, snapshot] of snapshots) {
    const linkedReport = reportCandidates.find((report) =>
      reportNamesMatch(report.reportName, snapshot.reportName),
    );
    if (linkedReport?.caseNames.has(caseName)) {
      snapshot.reportName = isRunRecapRelativePath(linkedReport.reportName)
        ? caseReportRelativePath(linkedReport.reportName, caseName)
        : linkedReport.reportName;
      continue;
    }
    const replacementReport = reportCandidates.find((report) => report.caseNames.has(caseName));
    if (replacementReport) {
      snapshot.reportName = isRunRecapRelativePath(replacementReport.reportName)
        ? caseReportRelativePath(replacementReport.reportName, caseName)
        : replacementReport.reportName;
    }
  }
  return snapshots;
}

export function renderVersionReport(
  cliVersion: string,
  checksum: string,
  snapshots: Map<string, CaseSnapshot>,
  updatedAt: Date,
): string {
  const commandOrder: DeclarativeCommand[] = ["generate", "sync", "sync-verification"];
  const resultRows: VersionResultRow[] = [...snapshots].flatMap(([caseName, snapshot]) =>
    commandOrder.map((command) => ({
      caseName,
      command,
      nextStatus: snapshot.results.get(`next:${command}`) ?? "—",
      legacyStatus: snapshot.results.get(`legacy:${command}`) ?? "—",
      reportName: snapshot.reportName,
    })),
  );
  resultRows.sort(
    (left, right) =>
      versionRowSeverity(left.nextStatus, left.legacyStatus) -
        versionRowSeverity(right.nextStatus, right.legacyStatus) ||
      compareCaseNames(left.caseName, right.caseName) ||
      commandOrder.indexOf(left.command) - commandOrder.indexOf(right.command),
  );
  const resultSections = [
    { heading: "Commands not run", severity: 0 },
    { heading: "Errors", severity: 1 },
    { heading: "Warnings", severity: 2 },
    { heading: "OK", severity: 3 },
  ].flatMap(({ heading, severity }) => [
    `## ${heading}`,
    "",
    "| Case | Command | Next | Legacy | Latest report for case |",
    "| --- | --- | --- | --- | --- |",
    ...resultRows
      .filter((row) => versionRowSeverity(row.nextStatus, row.legacyStatus) === severity)
      .map(
        (row) =>
          `| \`${row.caseName}\` | ${row.command} | **${row.nextStatus}** | **${row.legacyStatus}** | [\`${reportDisplayName(row.reportName)}\`](${versionReportHref(row.reportName, row.caseName)}) |`,
      ),
    "",
  ]);
  const sourceReportCount = new Set(
    [...snapshots.values()].map((snapshot) => reportRunKey(snapshot.reportName)),
  ).size;
  const recordedResults = resultRows.reduce(
    (count, row) => count + Number(row.nextStatus !== "—") + Number(row.legacyStatus !== "—"),
    0,
  );
  return [
    `# Supabase CLI version ${checksum}`,
    "",
    `- Supabase CLI version: \`${cliVersion}\``,
    `- Checksum: \`${checksum}\``,
    `- Updated: ${updatedAt.toISOString()}`,
    `- Source reports: ${sourceReportCount}`,
    `- Cases: ${snapshots.size}`,
    `- Recorded command results: ${recordedResults}`,
    "- A dash means that command was not run. Skipped commands are recorded as `ERROR`.",
    "",
    ...resultSections,
  ].join("\n");
}

export function updateVersionReportsFromReports(
  config: RunnerConfig,
  updatedAt = new Date(),
): void {
  const parsedReports = listReportRelativePaths(config.reportsDirectory)
    .map((reportRelativePath) => parseVersionReport(config.reportsDirectory, reportRelativePath))
    .filter((report) => report !== undefined)
    .sort(
      (left, right) =>
        left.generated.localeCompare(right.generated) ||
        left.reportName.localeCompare(right.reportName),
    );
  const reportsByChecksum = new Map<string, ParsedVersionReport[]>();
  for (const report of parsedReports) {
    const reports = reportsByChecksum.get(report.checksum) ?? [];
    reports.push(report);
    reportsByChecksum.set(report.checksum, reports);
  }
  mkdirSync(config.versionsDirectory, { recursive: true });

  for (const [checksum, reports] of reportsByChecksum) {
    const snapshots = existingVersionSnapshots(config, checksum);
    for (const report of reports) {
      for (const [caseName, results] of report.caseResults) {
        snapshots.set(caseName, {
          reportName: report.caseReportNames.get(caseName) ?? report.reportName,
          results,
        });
      }
    }
    const latestReport = reports.at(-1);
    if (!latestReport) continue;
    const versionName = `version-${checksum}.md`;
    writeFileSync(
      join(config.versionsDirectory, versionName),
      renderVersionReport(latestReport.cliVersion, checksum, snapshots, updatedAt),
      "utf8",
    );
    const datedVersionPattern = new RegExp(String.raw`^version-.+-${checksum}\.md$`);
    for (const datedVersionName of readdirSync(config.versionsDirectory).filter((name) =>
      datedVersionPattern.test(name),
    )) {
      rmSync(join(config.versionsDirectory, datedVersionName));
    }
  }
}
