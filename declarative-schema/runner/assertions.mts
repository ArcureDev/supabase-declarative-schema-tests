import type { CommandResult, GeneratedFile } from "./types.mts";

export function assertRenameAmbiguityHandledSafely(
  rawSync: CommandResult,
  generatedMigrationFiles: GeneratedFile[],
  sourceIdentifier: string,
): { result: CommandResult; summary: string } {
  const generatedSql = generatedMigrationFiles.map((file) => file.content).join("\n");
  const diagnosticText = `${rawSync.output}\n${generatedSql}`;
  const safetyDiagnosticPattern =
    /(?:\b(?:warn(?:ing)?|error|blocked|refus(?:e|ed|ing))\b.*\b(?:ambiguous|ambiguity|destructive|unsafe|data loss)\b|\b(?:ambiguous|ambiguity|destructive|unsafe|data loss)\b.*\b(?:warn(?:ing)?|error|blocked|refus(?:e|ed|ing))\b|\b(?:rename ambiguity|ambiguous rename|destructive changes?|unsafe operation|data loss|confirmation required|required confirmation)\b|\bcode=(?:rename_ambiguity|destructive_change|data_loss|unsafe_operation)\b)/i;
  const safetyDiagnostic = diagnosticText
    .split("\n")
    .map((line) => line.trim())
    .find((line) => safetyDiagnosticPattern.test(line));
  const hasSafetyDiagnostic = safetyDiagnostic !== undefined;
  const identifiesSource = diagnosticText.replaceAll('"', "").includes(sourceIdentifier);
  const inferredRename = /\balter\s+table\b[\s\S]*\brename\s+to\b/i.test(generatedSql);
  const rawOutcome =
    rawSync.status === "ERROR"
      ? "refused"
      : rawSync.status === "WARNING"
        ? "warned"
        : "completed";
  const safelyHandled = hasSafetyDiagnostic && identifiesSource && !inferredRename;
  const summary = safelyHandled
    ? `The command ${rawOutcome} with an explicit ambiguity/destructive-change diagnostic and did not infer a rename. Evidence: ${safetyDiagnostic}`
    : [
        `The command ${rawOutcome} without satisfying the rename-ambiguity safety contract.`,
        hasSafetyDiagnostic
          ? "A safety diagnostic was present."
          : "No explicit ambiguity, destructive-change, or data-loss diagnostic was present.",
        identifiesSource
          ? `The output identified ${sourceIdentifier}.`
          : `The output did not identify ${sourceIdentifier}.`,
        inferredRename
          ? "The generated SQL inferred ALTER TABLE ... RENAME TO without an explicit hint."
          : "The generated SQL did not infer ALTER TABLE ... RENAME TO.",
      ].join(" ");

  return {
    result: {
      ...rawSync,
      output: [
        summary,
        `Raw sync status: ${rawSync.status}`,
        rawSync.output,
        generatedSql ? `Generated migration SQL:\n${generatedSql}` : "No migration SQL was generated.",
      ]
        .filter(Boolean)
        .join("\n"),
      status: safelyHandled ? "OK" : "ERROR",
    },
    summary,
  };
}

export function requireNoSchemaChanges(result: CommandResult): CommandResult {
  if (result.status !== "ERROR" && !result.output.includes("No schema changes found")) {
    result.output = ['Expected sync output to contain "No schema changes found".', result.output]
      .filter(Boolean)
      .join("\n");
    result.status = "ERROR";
  }
  return result;
}

export function requireUnchangedDatabaseState(
  before: CommandResult,
  after: CommandResult,
): CommandResult {
  if (before.status !== "OK") {
    after.output = [
      "Could not verify unchanged state because the baseline state query failed.",
      before.output,
      after.output,
    ]
      .filter(Boolean)
      .join("\n");
    after.status = "ERROR";
  } else if (after.status === "OK" && after.output !== before.output) {
    after.output = [
      "The database changed while generating the non-applied transition.",
      `Before:\n${before.output}`,
      `After:\n${after.output}`,
    ].join("\n");
    after.status = "ERROR";
  }
  return after;
}
