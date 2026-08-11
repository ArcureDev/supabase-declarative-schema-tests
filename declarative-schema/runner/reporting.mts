import { existsSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
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

export function redactSensitiveValues(text: string, sensitiveValues: string[]): string {
  return redactSensitiveText(text, sensitiveValues);
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
    "#### Legacy-generated baseline migration files",
    "",
    ...markdownForGeneratedFiles(result.transitionBaselineMigrationFiles ?? []),
    "",
    "#### Legacy-generated transition migration files",
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
      `#### ${section.title} (legacy)`,
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

export function renderReport(
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
    if (result.kind === "coverage") {
      lines.push(
        `- Coverage: ${result.coverageDescription ?? result.name}`,
        `- Requirements: ${(result.coverageRequirements ?? []).map((requirement) => `\`${requirement}\``).join(", ")}`,
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
        `### ${result.transitionAssertionTitle ?? "Transition safety assertion"}`,
        "",
        `- Raw sync result: **${result.transitionRawSyncStatus ?? "SKIPPED"}**`,
        `- Assertion: **${result.transitionRepeatSync?.status ?? result.sync.status}**`,
        `- ${result.transitionSafetySummary ?? "The safety assertion did not run."}`,
        "",
        "### Generated transition migration files",
        "",
        ...markdownForGeneratedFiles(result.transitionMigrationFiles ?? []),
        "",
      );
      if (
        result.transitionRawSyncStatus === "WARNING" ||
        result.transitionRawSyncStatus === "ERROR"
      ) {
        lines.push(
          "### Raw transition diagnostic evidence",
          "",
          "```text",
          result.sync.output || "(no output)",
          "```",
          "",
        );
      }
      if (result.transitionSecondMigrationFiles) {
        lines.push(
          "### Repeated generated transition migration files",
          "",
          ...markdownForGeneratedFiles(result.transitionSecondMigrationFiles),
          "",
        );
      }
      if (result.transitionExpectedFailure) {
        lines.push(
          "### Expected migration failure assertion",
          "",
          `- Raw apply result: **${result.transitionFailureRawStatus ?? "SKIPPED"}**`,
          `- Assertion: **${result.transitionExpectedFailure.status}**`,
          `- ${result.transitionFailureSummary ?? "The expected failure assertion did not run."}`,
          "",
        );
      }
    } else if (result.kind === "snapshot" && hasIssue) {
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
    if (result.kind !== "coverage") {
      lines.push(
        "",
        "### Sync (pg-delta next)",
        "",
        ...markdownForCommand(result.sync),
        commandResultMarker(result.name, "next", "sync", result.sync),
        "",
      );
    }
    if (result.transitionRepeatSync) {
      lines.push(
        "### Repeat sync and deterministic comparison",
        "",
        ...markdownForCommand(result.transitionRepeatSync),
        "",
      );
    }
    if (result.transitionExpectedFailure) {
      lines.push(
        "### Apply migration expecting failure",
        "",
        ...markdownForCommand(result.transitionExpectedFailure),
        "",
      );
    }
    if (result.transitionFailureVerification) {
      lines.push(
        "### Verify rollback after expected failure",
        "",
        ...markdownForCommand(result.transitionFailureVerification),
        "",
      );
    }
    if (result.transitionRepair) {
      lines.push(
        "### Repair invalid data",
        "",
        ...markdownForCommand(result.transitionRepair),
        "",
      );
    }
    if (result.transitionRetry) {
      lines.push(
        "### Retry generated migration",
        "",
        ...markdownForCommand(result.transitionRetry),
        "",
      );
    }
    if (result.transitionApply) {
      lines.push(
        "### Apply generated transition migration",
        "",
        ...markdownForCommand(result.transitionApply),
        "",
      );
    }
    if (result.transitionVerification) {
      lines.push(
        "### Verify desired state B",
        "",
        ...markdownForCommand(result.transitionVerification),
        "",
      );
    }
    if (result.syncVerification) {
      lines.push(
        `### ${result.syncVerificationTitle ?? "Sync verification / convergence (pg-delta next)"}`,
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
    if (result.phaseResults) {
      for (const phase of result.phaseResults) {
        lines.push(
          `### ${phase.title} (${phase.plane} plane)`,
          "",
          ...markdownForCommand(phase.commandResult),
          "",
        );
      }
    }
    if (result.legacyTransition) {
      lines.push(...markdownForLegacyTransition(result.name, result.legacyTransition));
    }
  }

  if (cleanupError) {
    lines.push("## Shared runtime cleanup", "", ...markdownForCommand(cleanupError), "");
  }
  return redactSensitiveValues(
    `${lines.join("\n")}\n`,
    results.flatMap((result) => result.sensitiveValues ?? []),
  );
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
