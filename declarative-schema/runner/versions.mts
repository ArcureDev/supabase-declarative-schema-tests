import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { caseAnchor } from "./reporting.mts";
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

export function parseVersionReport(
  reportsDirectory: string,
  reportName: string,
): ParsedVersionReport | undefined {
  const report = readFileSync(join(reportsDirectory, reportName), "utf8");
  const checksum = /^- Checksum: `([0-9a-f]{7})`$/im.exec(report)?.[1];
  const cliVersion = /^- Supabase CLI version: `([^`]+)`$/m.exec(report)?.[1];
  const generated = /^- Generated: (.+)$/m.exec(report)?.[1];
  if (!checksum || !cliVersion || !generated) return undefined;

  const caseResults = new Map<string, Map<string, VersionResultStatus>>();
  const markerPattern =
    /<!-- declarative-schema-command-result case="([^"]+)" engine="(next|legacy)" command="(generate|sync|sync-verification)" status="(OK|WARNING|ERROR)" -->/g;
  for (const marker of report.matchAll(markerPattern)) {
    const caseName = marker[1];
    const engine = marker[2];
    const command = marker[3];
    const status = marker[4] as VersionResultStatus | undefined;
    if (!caseName || !engine || !command || !status) continue;
    const results = caseResults.get(caseName) ?? new Map<string, VersionResultStatus>();
    results.set(`${engine}:${command}`, status);
    caseResults.set(caseName, results);
  }
  if (caseResults.size === 0) return undefined;
  return { checksum, cliVersion, generated, reportName, caseResults };
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
    /^\| `([^`]+)` \| (generate|sync|sync-verification) \| \*\*(OK|WARNING|ERROR|—)\*\* \| \*\*(OK|WARNING|ERROR|—)\*\* \| \[`(report-[^`]+\.md)`\]/gm;
  for (const row of versionReport.matchAll(rowPattern)) {
    const caseName = row[1];
    const command = row[2];
    const nextStatus = row[3];
    const legacyStatus = row[4];
    const reportName = row[5];
    if (!caseName || !command || !nextStatus || !legacyStatus || !reportName) continue;
    const snapshot = snapshots.get(caseName) ?? {
      reportName,
      results: new Map<string, VersionResultStatus>(),
    };
    if (nextStatus !== "—") {
      snapshot.results.set(`next:${command}`, nextStatus as VersionResultStatus);
    }
    if (legacyStatus !== "—") {
      snapshot.results.set(`legacy:${command}`, legacyStatus as VersionResultStatus);
    }
    snapshots.set(caseName, snapshot);
  }

  const reportCandidates = readdirSync(config.reportsDirectory)
    .filter((reportName) => /^report-.*\.md$/.test(reportName))
    .sort()
    .reverse()
    .map((reportName) => {
      const report = readFileSync(join(config.reportsDirectory, reportName), "utf8");
      return {
        reportName,
        checksum: /^- Checksum: `([0-9a-f]{7})`$/im.exec(report)?.[1],
        caseNames: new Set(
          [...report.matchAll(/^## (.+)$/gm)]
            .map((heading) => heading[1])
            .filter((heading) => heading !== undefined)
            .map((heading) => heading.trimEnd().replace(/^Case: /, "")),
        ),
      };
    })
    .filter((report) => report.checksum === undefined || report.checksum === checksum);
  for (const [caseName, snapshot] of snapshots) {
    const linkedReport = reportCandidates.find(
      (report) => report.reportName === snapshot.reportName,
    );
    if (linkedReport?.caseNames.has(caseName)) continue;
    const replacementReport = reportCandidates.find((report) => report.caseNames.has(caseName));
    if (replacementReport) snapshot.reportName = replacementReport.reportName;
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
          `| \`${row.caseName}\` | ${row.command} | **${row.nextStatus}** | **${row.legacyStatus}** | [\`${row.reportName}\`](../reports/${row.reportName}#${caseAnchor(row.caseName)}) |`,
      ),
    "",
  ]);
  const sourceReportCount = new Set(
    [...snapshots.values()].map((snapshot) => snapshot.reportName),
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
  const parsedReports = readdirSync(config.reportsDirectory)
    .filter((reportName) => /^report-.*\.md$/.test(reportName))
    .map((reportName) => parseVersionReport(config.reportsDirectory, reportName))
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
        snapshots.set(caseName, { reportName: report.reportName, results });
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
