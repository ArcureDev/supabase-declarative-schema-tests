import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { formatDuration } from "./commands.mts";
import { redactSensitiveText } from "./sensitive.mts";
import { legacyProjectStatus, projectStatus, requiresFallback, versionResultStatus } from "./status.mts";
import type {
  CommandResult,
  DeclarativeCommand,
  DeclarativeEngine,
  GeneratedFile,
  ProjectResult,
  RunnerConfig,
} from "./types.mts";

const legacyReportFileNamePattern = /^report-.*\.md$/;
const runRecapFileName = "0-recap.md";
const reportTimestampPattern = /(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d+Z)/;

/** Sort key shared by legacy `report-….md` files and per-run timestamp directories. */
export function reportSortKey(reportRelativePath: string): string {
  return reportTimestampPattern.exec(reportRelativePath)?.[1] ?? reportRelativePath;
}

export function isRunRecapRelativePath(reportRelativePath: string): boolean {
  return reportRelativePath.replaceAll("\\", "/").endsWith(`/${runRecapFileName}`);
}

export function caseReportFileName(caseName: string): string {
  const digits = /^\d+/.exec(caseName)?.[0];
  if (digits !== undefined) return `case-${Number(digits)}.md`;
  return `${caseAnchor(caseName)}.md`;
}

export function caseReportRelativePath(
  runRecapRelativePath: string,
  caseName: string,
): string {
  if (!isRunRecapRelativePath(runRecapRelativePath)) return runRecapRelativePath;
  const runDirectory = runRecapRelativePath.replaceAll("\\", "/").slice(0, -runRecapFileName.length - 1);
  return `${runDirectory}/${caseReportFileName(caseName)}`;
}

/** Relative paths from reportsDirectory, using forward slashes. */
export function listReportRelativePaths(reportsDirectory: string): string[] {
  if (!existsSync(reportsDirectory)) return [];
  const reportPaths: string[] = [];

  const collectFromDirectory = (directoryRelativePath: string | undefined): void => {
    const absoluteDirectory =
      directoryRelativePath === undefined
        ? reportsDirectory
        : join(reportsDirectory, ...directoryRelativePath.split("/"));
    for (const entry of readdirSync(absoluteDirectory, { withFileTypes: true })) {
      const entryRelativePath =
        directoryRelativePath === undefined ? entry.name : `${directoryRelativePath}/${entry.name}`;
      if (entry.isFile() && legacyReportFileNamePattern.test(entry.name)) {
        reportPaths.push(entryRelativePath);
        continue;
      }
      if (!entry.isDirectory()) continue;
      if (existsSync(join(absoluteDirectory, entry.name, runRecapFileName))) {
        reportPaths.push(`${entryRelativePath}/${runRecapFileName}`);
        continue;
      }
      if (directoryRelativePath === undefined) {
        collectFromDirectory(entry.name);
      }
    }
  };

  collectFromDirectory(undefined);
  return reportPaths.sort(
    (left, right) =>
      reportSortKey(left).localeCompare(reportSortKey(right)) || left.localeCompare(right),
  );
}

export function createReportDirectory(
  reportsDirectory: string,
  checksum: string,
  now = new Date(),
): string {
  const versionReportsDirectory = join(reportsDirectory, checksum);
  mkdirSync(versionReportsDirectory, { recursive: true });
  const timestamp = now.toISOString().replaceAll(":", "-").replaceAll(".", "-");
  let reportDirectory = join(versionReportsDirectory, timestamp);
  let collisionIndex = 2;
  while (existsSync(reportDirectory)) {
    reportDirectory = join(versionReportsDirectory, `${timestamp}-${collisionIndex}`);
    collisionIndex += 1;
  }
  mkdirSync(reportDirectory, { recursive: true });
  return reportDirectory;
}

export function reportDisplayName(reportRelativePath: string): string {
  return basename(reportRelativePath);
}

export function versionReportHref(reportRelativePath: string, caseName: string): string {
  const normalized = reportRelativePath.replaceAll("\\", "/");
  const isLegacyMonolith = /(?:^|\/)report-[^/]+\.md$/.test(normalized);
  return isLegacyMonolith
    ? `../reports/${normalized}#${caseAnchor(caseName)}`
    : `../reports/${normalized}`;
}

export function reportRunKey(reportRelativePath: string): string {
  const normalized = reportRelativePath.replaceAll("\\", "/");
  if (
    isRunRecapRelativePath(normalized) ||
    /\/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d+Z(?:-\d+)?\/[^/]+\.md$/.test(normalized)
  ) {
    return dirname(normalized).replaceAll("\\", "/");
  }
  return normalized;
}

export function redactSensitiveValues(text: string, sensitiveValues: string[]): string {
  return redactSensitiveText(text, sensitiveValues);
}

export function markdownForCommand(result: CommandResult): string[] {
  const lines = [
    `- Command: \`${result.command}\``,
    `- Result: **${result.status}**`,
    `- Duration: \`${formatDuration(result.durationMilliseconds)}\``,
  ];
  if (requiresFallback(result) && result.exitCode !== null) {
    lines.push(`- Exit code: \`${result.exitCode}\``);
  }
  if (result.status !== "OK") {
    lines.push("", "```text", result.output || "(no output)", "```");
  }
  return lines;
}

export function markdownForGeneratedFiles(files: GeneratedFile[]): string[] {
  if (files.length === 0) return ["_(no files generated)_"];
  return files.flatMap((file) => {
    let fence = "```";
    while (file.content.includes(fence)) fence += "`";
    return [`### \`${file.path}\``, "", `${fence}sql`, file.content || "(empty file)", fence, ""];
  });
}

export function commandResultMarker(
  caseName: string,
  engine: DeclarativeEngine,
  command: DeclarativeCommand,
  result: CommandResult,
): string {
  return `<!-- declarative-schema-command-result case="${caseName}" engine="${engine}" command="${command}" status="${versionResultStatus(result)}" -->`;
}

export function caseAnchor(caseName: string): string {
  return `case-${caseName
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;
}

function projectCommandResults(result: ProjectResult): CommandResult[] {
  const commands = [
    result.runtimeStart,
    result.reset,
    result.baselineSync,
    result.dataSetup,
    result.baselineState,
    result.generate,
    result.legacyGenerate,
    result.sync,
    result.transitionRepeatSync,
    result.transitionApply,
    result.transitionExpectedFailure,
    result.transitionFailureVerification,
    result.transitionRepair,
    result.transitionRetry,
    result.transitionVerification,
    result.syncVerification,
    result.legacySync,
    result.legacySyncVerification,
    ...(result.phaseResults ?? []).map((phase) => phase.commandResult),
  ].filter((commandResult) => commandResult !== undefined);
  return result.legacyTransition
    ? [...commands, ...projectCommandResults(result.legacyTransition)]
    : commands;
}

function markdownForLegacyTransition(
  caseName: string,
  result: ProjectResult,
): string[] {
  const lines = [
    "### Transition fallback (legacy)",
    "",
    `- Overall result: **${projectStatus(result)}**`,
    `- Raw sync result: **${result.transitionRawSyncStatus ?? "SKIPPED"}**`,
    `- Assertion: **${result.transitionRepeatSync?.status ?? result.sync.status}**`,
    `- ${result.transitionSafetySummary ?? "The safety assertion did not run."}`,
    "",
    "### Legacy-generated baseline migration files",
    "",
    ...markdownForGeneratedFiles(result.transitionBaselineMigrationFiles ?? []),
    "",
    "### Legacy-generated transition migration files",
    "",
    ...markdownForGeneratedFiles(result.transitionMigrationFiles ?? []),
    "",
  ];
  const commandSections: Array<{
    title: string;
    result: CommandResult | undefined;
    marker?: DeclarativeCommand | undefined;
  }> = [
    { title: "Start local runtime", result: result.runtimeStart },
    { title: "Clear local runtime before baseline", result: result.reset },
    { title: "Establish baseline", result: result.baselineSync },
    { title: "Insert representative data", result: result.dataSetup },
    { title: "Capture baseline state", result: result.baselineState },
    { title: "Sync", result: result.sync, marker: "sync" },
    { title: "Repeat sync and deterministic comparison", result: result.transitionRepeatSync },
    { title: "Apply generated transition migration", result: result.transitionApply },
    { title: "Apply migration expecting failure", result: result.transitionExpectedFailure },
    { title: "Verify rollback after expected failure", result: result.transitionFailureVerification },
    { title: "Repair invalid data", result: result.transitionRepair },
    { title: "Retry generated migration", result: result.transitionRetry },
    { title: "Verify desired state B", result: result.transitionVerification },
    { title: "Sync verification / convergence", result: result.syncVerification, marker: "sync-verification" },
  ];
  for (const section of commandSections) {
    if (!section.result) continue;
    lines.push(
      `### ${section.title} (legacy)`,
      "",
      ...markdownForCommand(section.result),
      ...(section.marker
        ? [commandResultMarker(caseName, "legacy", section.marker, section.result)]
        : []),
      "",
    );
  }
  return lines;
}

export function renderRecap(
  config: RunnerConfig,
  results: ProjectResult[],
  runDirectory: string,
  cleanupError: CommandResult | undefined,
  generatedAt: Date,
): string {
  const projectCommands = results.flatMap(projectCommandResults);
  const lines = [
    "# Supabase declarative schema CLI report",
    "",
    `- Generated: ${generatedAt.toISOString()}`,
    `- Supabase CLI version: \`${config.supabaseCliVersion}\``,
    `- Checksum: \`${config.supabaseChecksum}\``,
    "- Primary engine: pg-delta next (`SUPABASE_USE_PG_DELTA_NEXT=true`)",
    "- Fallback: snapshot declarative failures and transition warnings/failures are retried with legacy (`SUPABASE_USE_PG_DELTA_NEXT=false`)",
    `- Cases: ${results.length}`,
    `- Commands OK: ${projectCommands.filter((result) => result.status === "OK").length}`,
    `- Commands with warnings: ${projectCommands.filter((result) => result.status === "WARNING").length}`,
    `- Commands failed: ${projectCommands.filter((result) => result.status === "ERROR").length}`,
    `- Commands skipped: ${projectCommands.filter((result) => result.status === "SKIPPED").length}`,
    "- Runtime: one shared local PostgreSQL container, reset between projects",
    `- Working copies: \`${relative(config.scriptDirectory, runDirectory)}\``,
    "",
    '<a id="case-results"></a>',
    "",
    "## Case results",
    "",
    "| Case | Primary | Legacy | Detail |",
    "| --- | --- | --- | --- |",
    ...results.map(
      (result) =>
        `| \`${result.name}\` | **${projectStatus(result)}** | **${legacyProjectStatus(result)}** | [\`${caseReportFileName(result.name)}\`](./${caseReportFileName(result.name)}) |`,
    ),
    "",
    ...results.map(
      (result) =>
        `<!-- declarative-schema-case-result name="${result.name}" status="${projectStatus(result)}" -->`,
    ),
    "",
  ];

  if (cleanupError) {
    lines.push("## Shared runtime cleanup", "", ...markdownForCommand(cleanupError), "");
  }
  return redactSensitiveValues(
    `${lines.join("\n")}\n`,
    results.flatMap((result) => result.sensitiveValues ?? []),
  );
}

export function renderCaseReport(result: ProjectResult): string {
  const lines = [`# Case: ${result.name}`, ""];
  if (result.kind === "coverage") {
    lines.push(
      `- Coverage: ${result.coverageDescription ?? result.name}`,
      `- Requirements: ${(result.coverageRequirements ?? []).map((requirement) => `\`${requirement}\``).join(", ")}`,
      ...(result.catalogueAtoms && result.catalogueAtoms.length > 0
        ? [
            `- Catalogue atoms: ${result.catalogueAtoms.map((atom) => `\`${atom}\``).join(", ")}`,
          ]
        : []),
      "",
    );
  }
  if (result.kind === "transition" && result.packScenarioId) {
    lines.push(
      `- Scenario pack: \`${result.packDescription ?? result.packDirectory ?? "pack"}\` / \`${result.packScenarioId}\``,
      ...(result.catalogueAtoms && result.catalogueAtoms.length > 0
        ? [
            `- Catalogue atoms: ${result.catalogueAtoms.map((atom) => `\`${atom}\``).join(", ")}`,
          ]
        : []),
      "",
    );
  }
  const hasIssue = [
    result.runtimeStart,
    result.reset,
    result.baselineSync,
    result.dataSetup,
    result.baselineState,
    result.generate,
    result.legacyGenerate,
    result.sync,
    result.transitionRepeatSync,
    result.transitionApply,
    result.transitionExpectedFailure,
    result.transitionFailureVerification,
    result.transitionRepair,
    result.transitionRetry,
    result.transitionVerification,
    result.syncVerification,
    result.legacySync,
    result.legacySyncVerification,
    ...(result.phaseResults ?? []).map((phase) => phase.commandResult),
  ].some((commandResult) => commandResult && requiresFallback(commandResult));

  if (result.kind === "transition") {
    lines.push(
      "## Baseline state A",
      "",
      "```sql",
      result.migrationSql,
      "```",
      "",
      "## Desired state B",
      "",
      "```sql",
      result.desiredSql ?? "",
      "```",
      "",
      "## Representative data setup",
      "",
      "```sql",
      result.dataSetupSql ?? "",
      "```",
      "",
      "## CLI-generated baseline migration files",
      "",
      ...markdownForGeneratedFiles(result.transitionBaselineMigrationFiles ?? []),
      "",
      `## ${result.transitionAssertionTitle ?? "Transition safety assertion"}`,
      "",
      `- Raw sync result: **${result.transitionRawSyncStatus ?? "SKIPPED"}**`,
      `- Assertion: **${result.transitionRepeatSync?.status ?? result.sync.status}**`,
      `- ${result.transitionSafetySummary ?? "The safety assertion did not run."}`,
      "",
      "## Generated transition migration files",
      "",
      ...markdownForGeneratedFiles(result.transitionMigrationFiles ?? []),
      "",
    );
    if (
      result.transitionRawSyncStatus === "WARNING" ||
      result.transitionRawSyncStatus === "ERROR"
    ) {
      lines.push(
        "## Raw transition diagnostic evidence",
        "",
        "```text",
        result.sync.output || "(no output)",
        "```",
        "",
      );
    }
    if (result.transitionSecondMigrationFiles) {
      lines.push(
        "## Repeated generated transition migration files",
        "",
        ...markdownForGeneratedFiles(result.transitionSecondMigrationFiles),
        "",
      );
    }
    if (result.transitionExpectedFailure) {
      lines.push(
        "## Expected migration failure assertion",
        "",
        `- Raw apply result: **${result.transitionFailureRawStatus ?? "SKIPPED"}**`,
        `- Assertion: **${result.transitionExpectedFailure.status}**`,
        `- ${result.transitionFailureSummary ?? "The expected failure assertion did not run."}`,
        "",
      );
    }
  } else if (result.kind === "snapshot" && hasIssue) {
    lines.push("## Fixture migration SQL", "", "```sql", result.migrationSql, "```", "");
  }

  if (result.generate && requiresFallback(result.generate)) {
    lines.push("## Generated declarative files (pg-delta next)", "");
    lines.push(...markdownForGeneratedFiles(result.nextGeneratedFiles ?? []), "");
    lines.push("## Generated declarative files (legacy)", "");
    lines.push(...markdownForGeneratedFiles(result.legacyGeneratedFiles ?? []), "");
  }
  if (result.runtimeStart) {
    lines.push("## Start local runtime", "", ...markdownForCommand(result.runtimeStart), "");
  }
  if (result.reset) {
    lines.push(
      result.kind === "transition" ? "## Clear local runtime before baseline" : "## Reset",
      "",
      ...markdownForCommand(result.reset),
      "",
    );
  }
  if (result.generate) {
    lines.push(
      "## Generate (pg-delta next)",
      "",
      ...markdownForCommand(result.generate),
      commandResultMarker(result.name, "next", "generate", result.generate),
    );
  }
  if (result.legacyGenerate) {
    lines.push(
      "",
      "## Generate fallback (legacy)",
      "",
      ...markdownForCommand(result.legacyGenerate),
      commandResultMarker(result.name, "legacy", "generate", result.legacyGenerate),
    );
  }
  if (result.baselineSync) {
    lines.push(
      "",
      "## Establish baseline with declarative sync --apply",
      "",
      ...markdownForCommand(result.baselineSync),
      "",
    );
  }
  if (result.dataSetup) {
    lines.push("## Insert representative data", "", ...markdownForCommand(result.dataSetup), "");
  }
  if (result.baselineState) {
    lines.push("## Baseline state capture", "", ...markdownForCommand(result.baselineState), "");
  }
  if (result.kind !== "coverage") {
    lines.push(
      "",
      "## Sync (pg-delta next)",
      "",
      ...markdownForCommand(result.sync),
      commandResultMarker(result.name, "next", "sync", result.sync),
      "",
    );
  }
  if (result.transitionRepeatSync) {
    lines.push(
      "## Repeat sync and deterministic comparison",
      "",
      ...markdownForCommand(result.transitionRepeatSync),
      "",
    );
  }
  if (result.transitionExpectedFailure) {
    lines.push(
      "## Apply migration expecting failure",
      "",
      ...markdownForCommand(result.transitionExpectedFailure),
      "",
    );
  }
  if (result.transitionFailureVerification) {
    lines.push(
      "## Verify rollback after expected failure",
      "",
      ...markdownForCommand(result.transitionFailureVerification),
      "",
    );
  }
  if (result.transitionRepair) {
    lines.push(
      "## Repair invalid data",
      "",
      ...markdownForCommand(result.transitionRepair),
      "",
    );
  }
  if (result.transitionRetry) {
    lines.push(
      "## Retry generated migration",
      "",
      ...markdownForCommand(result.transitionRetry),
      "",
    );
  }
  if (result.transitionApply) {
    lines.push(
      "## Apply generated transition migration",
      "",
      ...markdownForCommand(result.transitionApply),
      "",
    );
  }
  if (result.transitionVerification) {
    lines.push(
      "## Verify desired state B",
      "",
      ...markdownForCommand(result.transitionVerification),
      "",
    );
  }
  if (result.syncVerification) {
    lines.push(
      `## ${result.syncVerificationTitle ?? "Sync verification / convergence (pg-delta next)"}`,
      "",
      ...markdownForCommand(result.syncVerification),
      commandResultMarker(result.name, "next", "sync-verification", result.syncVerification),
      "",
    );
  }
  if (result.legacySync) {
    lines.push(
      "## Sync fallback (legacy)",
      "",
      ...markdownForCommand(result.legacySync),
      commandResultMarker(result.name, "legacy", "sync", result.legacySync),
      "",
    );
  }
  if (result.legacySyncVerification) {
    lines.push(
      "## Sync verification fallback (legacy)",
      "",
      ...markdownForCommand(result.legacySyncVerification),
      commandResultMarker(
        result.name,
        "legacy",
        "sync-verification",
        result.legacySyncVerification,
      ),
      "",
    );
  }
  if (result.phaseResults) {
    for (const phase of result.phaseResults) {
      lines.push(
        `## ${phase.title} (${phase.plane} plane)`,
        "",
        ...markdownForCommand(phase.commandResult),
        "",
      );
    }
  }
  if (result.kind === "coverage") {
    // Coverage planes do not run generate/sync/sync-verification. Record the
    // overall case outcome under all three matrix commands so version files and
    // --not-ok treat a finished coverage run as complete evidence.
    const coverageStatus = projectStatus(result);
    const coverageEvaluation: CommandResult = {
      command: "coverage evaluation",
      durationMilliseconds: 0,
      exitCode: coverageStatus === "OK" ? 0 : 1,
      output: "",
      status: coverageStatus === "FAILED" ? "ERROR" : coverageStatus,
    };
    lines.push(
      "## Coverage evaluation",
      "",
      ...markdownForCommand(coverageEvaluation),
      commandResultMarker(result.name, "next", "generate", coverageEvaluation),
      commandResultMarker(result.name, "next", "sync", coverageEvaluation),
      commandResultMarker(result.name, "next", "sync-verification", coverageEvaluation),
      "",
    );
  }
  if (result.legacyTransition) {
    lines.push(...markdownForLegacyTransition(result.name, result.legacyTransition));
  }
  return redactSensitiveValues(`${lines.join("\n")}\n`, result.sensitiveValues ?? []);
}

/** Combined markdown for tests and callers that still want one document. */
export function renderReport(
  config: RunnerConfig,
  results: ProjectResult[],
  runDirectory: string,
  cleanupError: CommandResult | undefined,
  generatedAt: Date,
): string {
  return [
    renderRecap(config, results, runDirectory, cleanupError, generatedAt).trimEnd(),
    "",
    ...results.map((result) => renderCaseReport(result).trimEnd()),
    "",
  ].join("\n\n");
}

export function writeReport(
  config: RunnerConfig,
  reportDirectory: string,
  results: ProjectResult[],
  runDirectory: string,
  cleanupError?: CommandResult,
  generatedAt = new Date(),
): void {
  mkdirSync(reportDirectory, { recursive: true });
  writeFileSync(
    join(reportDirectory, runRecapFileName),
    renderRecap(config, results, runDirectory, cleanupError, generatedAt),
    "utf8",
  );
  for (const result of results) {
    writeFileSync(
      join(reportDirectory, caseReportFileName(result.name)),
      renderCaseReport(result),
      "utf8",
    );
  }
}
