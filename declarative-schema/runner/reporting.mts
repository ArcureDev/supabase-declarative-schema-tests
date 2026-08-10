import { existsSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { legacyProjectStatus, projectStatus, requiresFallback, versionResultStatus } from "./status.mts";
import type {
  CommandResult,
  DeclarativeCommand,
  DeclarativeEngine,
  GeneratedFile,
  ProjectResult,
  RunnerConfig,
} from "./types.mts";

export function createReportPath(reportsDirectory: string, now = new Date()): string {
  const timestamp = now.toISOString().replaceAll(":", "-").replaceAll(".", "-");
  const baseName = `report-${timestamp}`;
  let reportPath = join(reportsDirectory, `${baseName}.md`);
  let collisionIndex = 2;
  while (existsSync(reportPath)) {
    reportPath = join(reportsDirectory, `${baseName}-${collisionIndex}.md`);
    collisionIndex += 1;
  }
  return reportPath;
}

export function markdownForCommand(result: CommandResult): string[] {
  const lines = [`- Command: \`${result.command}\``, `- Result: **${result.status}**`];
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
    return [`#### \`${file.path}\``, "", `${fence}sql`, file.content || "(empty file)", fence, ""];
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

export function renderReport(
  config: RunnerConfig,
  results: ProjectResult[],
  runDirectory: string,
  cleanupError: CommandResult | undefined,
  generatedAt: Date,
): string {
  const projectCommands = results.flatMap((result) => [
    ...(result.runtimeStart ? [result.runtimeStart] : []),
    ...(result.reset ? [result.reset] : []),
    ...(result.baselineSync ? [result.baselineSync] : []),
    ...(result.dataSetup ? [result.dataSetup] : []),
    ...(result.baselineState ? [result.baselineState] : []),
    ...(result.generate ? [result.generate] : []),
    ...(result.legacyGenerate ? [result.legacyGenerate] : []),
    result.sync,
    ...(result.syncVerification ? [result.syncVerification] : []),
    ...(result.legacySync ? [result.legacySync] : []),
    ...(result.legacySyncVerification ? [result.legacySyncVerification] : []),
  ]);
  const lines = [
    "# Supabase declarative schema CLI report",
    "",
    `- Generated: ${generatedAt.toISOString()}`,
    `- Supabase CLI version: \`${config.supabaseCliVersion}\``,
    `- Checksum: \`${config.supabaseChecksum}\``,
    "- Primary engine: pg-delta next (`SUPABASE_USE_PG_DELTA_NEXT=true`)",
    "- Snapshot fallback: failed declarative commands are retried with legacy (`SUPABASE_USE_PG_DELTA_NEXT=false`)",
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
    "| Case | Primary | Legacy |",
    "| --- | --- | --- |",
    ...results.map(
      (result) =>
        `| \`${result.name}\` | **${projectStatus(result)}** | **${legacyProjectStatus(result)}** |`,
    ),
    "",
    ...results.map(
      (result) =>
        `<!-- declarative-schema-case-result name="${result.name}" status="${projectStatus(result)}" -->`,
    ),
    "",
  ];

  for (const result of results) {
    lines.push(`## Case: ${result.name}`, "");
    const hasIssue = [
      result.runtimeStart,
      result.reset,
      result.baselineSync,
      result.dataSetup,
      result.baselineState,
      result.generate,
      result.legacyGenerate,
      result.sync,
      result.syncVerification,
      result.legacySync,
      result.legacySyncVerification,
    ].some((commandResult) => commandResult && requiresFallback(commandResult));

    if (result.kind === "transition") {
      lines.push(
        "### Baseline state A",
        "",
        "```sql",
        result.migrationSql,
        "```",
        "",
        "### Desired state B",
        "",
        "```sql",
        result.desiredSql ?? "",
        "```",
        "",
        "### Representative data setup",
        "",
        "```sql",
        result.dataSetupSql ?? "",
        "```",
        "",
        "### CLI-generated baseline migration files",
        "",
        ...markdownForGeneratedFiles(result.transitionBaselineMigrationFiles ?? []),
        "",
        "### Rename-ambiguity safety assertion",
        "",
        `- Raw sync result: **${result.transitionRawSyncStatus ?? "SKIPPED"}**`,
        `- Assertion: **${result.sync.status}**`,
        `- ${result.transitionSafetySummary ?? "The safety assertion did not run."}`,
        "",
        "### Generated transition migration files",
        "",
        ...markdownForGeneratedFiles(result.transitionMigrationFiles ?? []),
        "",
      );
    } else if (hasIssue) {
      lines.push("### Fixture migration SQL", "", "```sql", result.migrationSql, "```", "");
    }

    if (result.generate && requiresFallback(result.generate)) {
      lines.push("### Generated declarative files (pg-delta next)", "");
      lines.push(...markdownForGeneratedFiles(result.nextGeneratedFiles ?? []), "");
      lines.push("### Generated declarative files (legacy)", "");
      lines.push(...markdownForGeneratedFiles(result.legacyGeneratedFiles ?? []), "");
    }
    if (result.runtimeStart) {
      lines.push("### Start local runtime", "", ...markdownForCommand(result.runtimeStart), "");
    }
    if (result.reset) {
      lines.push(
        result.kind === "transition" ? "### Clear local runtime before baseline" : "### Reset",
        "",
        ...markdownForCommand(result.reset),
        "",
      );
    }
    if (result.generate) {
      lines.push(
        "### Generate (pg-delta next)",
        "",
        ...markdownForCommand(result.generate),
        commandResultMarker(result.name, "next", "generate", result.generate),
      );
    }
    if (result.legacyGenerate) {
      lines.push(
        "",
        "### Generate fallback (legacy)",
        "",
        ...markdownForCommand(result.legacyGenerate),
        commandResultMarker(result.name, "legacy", "generate", result.legacyGenerate),
      );
    }
    if (result.baselineSync) {
      lines.push(
        "",
        "### Establish baseline with declarative sync --apply",
        "",
        ...markdownForCommand(result.baselineSync),
        "",
      );
    }
    if (result.dataSetup) {
      lines.push("### Insert representative data", "", ...markdownForCommand(result.dataSetup), "");
    }
    if (result.baselineState) {
      lines.push("### Baseline state capture", "", ...markdownForCommand(result.baselineState), "");
    }
    lines.push(
      "",
      "### Sync (pg-delta next)",
      "",
      ...markdownForCommand(result.sync),
      commandResultMarker(result.name, "next", "sync", result.sync),
      "",
    );
    if (result.syncVerification) {
      lines.push(
        "### Sync verification (pg-delta next)",
        "",
        ...markdownForCommand(result.syncVerification),
        commandResultMarker(result.name, "next", "sync-verification", result.syncVerification),
        "",
      );
    }
    if (result.legacySync) {
      lines.push(
        "### Sync fallback (legacy)",
        "",
        ...markdownForCommand(result.legacySync),
        commandResultMarker(result.name, "legacy", "sync", result.legacySync),
        "",
      );
    }
    if (result.legacySyncVerification) {
      lines.push(
        "### Sync verification fallback (legacy)",
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
  }

  if (cleanupError) {
    lines.push("## Shared runtime cleanup", "", ...markdownForCommand(cleanupError), "");
  }
  return `${lines.join("\n")}\n`;
}

export function writeReport(
  config: RunnerConfig,
  reportPath: string,
  results: ProjectResult[],
  runDirectory: string,
  cleanupError?: CommandResult,
  generatedAt = new Date(),
): void {
  writeFileSync(
    reportPath,
    renderReport(config, results, runDirectory, cleanupError, generatedAt),
    "utf8",
  );
}
