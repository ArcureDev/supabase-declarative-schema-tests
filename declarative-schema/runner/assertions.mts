import type {
  CommandResult,
  DependencyOrderingTransition,
  GeneratedFile,
  MigrationPatternAssertion,
} from "./types.mts";
import { sensitiveRepresentations } from "./sensitive.mts";

function stripSqlComments(sql: string): string {
  return sql
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/--[^\n]*(?:\n|$)/g, "\n");
}

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
      status: safelyHandled
        ? "OK"
        : rawSync.exitCode === 0
          ? "WARNING"
          : "ERROR",
    },
    summary,
  };
}

export function assertDestructiveColumnDropHandledSafely(
  rawSync: CommandResult,
  generatedMigrationFiles: GeneratedFile[],
  tableIdentifier: string,
  columnIdentifier: string,
): { result: CommandResult; summary: string } {
  const generatedSql = generatedMigrationFiles.map((file) => file.content).join("\n");
  const generatedComments = generatedSql
    .split("\n")
    .filter((line) => /^\s*(?:--|\/\*)/.test(line))
    .join("\n");
  const diagnosticText = `${rawSync.output}\n${generatedComments}`;
  const identificationText = `${rawSync.output}\n${generatedSql}`
    .replaceAll('"', "")
    .toLowerCase();
  const normalizedSql = generatedSql.replaceAll('"', "").toLowerCase();
  const escapedTable = tableIdentifier
    .toLowerCase()
    .split(".")
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join(String.raw`\s*\.\s*`);
  const escapedColumn = columnIdentifier
    .toLowerCase()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const safetyDiagnosticPattern =
    /(?:\b(?:warn(?:ing)?|error|blocked|refus(?:e|ed|ing))\b.*\b(?:destructive\s+(?:change|drop)|unsafe\s+operation|data\s+loss|drop\s+column)\b|\b(?:destructive\s+(?:change|drop)|unsafe\s+operation|data\s+loss|drop\s+column)\b.*\b(?:warn(?:ing)?|error|blocked|refus(?:e|ed|ing)|confirmation)\b|\bfound\s+drop\s+statements?\s+in\s+(?:the\s+)?schema\s+diff\b.*\b(?:double\s+check|expected)\b|\bcode=(?:destructive_change|data_loss|unsafe_operation)\b)/i;
  const safetyDiagnostic = diagnosticText
    .split("\n")
    .map((line) => line.trim())
    .find((line) => safetyDiagnosticPattern.test(line));
  const identifiesTable = identificationText.includes(tableIdentifier.toLowerCase());
  const identifiesColumn = identificationText.includes(columnIdentifier.toLowerCase());
  const plannedColumnDrop = new RegExp(
    String.raw`\balter\s+table\s+(?:only\s+)?${escapedTable}\b[\s\S]*?\bdrop\s+(?:column\s+)?${escapedColumn}\b`,
    "i",
  ).test(normalizedSql);
  const safelyRefused = rawSync.status === "ERROR" && generatedMigrationFiles.length === 0;
  const safelyHandled =
    safetyDiagnostic !== undefined &&
    identifiesTable &&
    identifiesColumn &&
    (plannedColumnDrop || safelyRefused);
  const rawOutcome =
    rawSync.status === "ERROR"
      ? "refused"
      : rawSync.status === "WARNING"
        ? "warned"
        : "completed";
  const summary = safelyHandled
    ? `The command ${rawOutcome} with an explicit destructive-change diagnostic for ${tableIdentifier}.${columnIdentifier}; no migration was applied. Evidence: ${safetyDiagnostic}`
    : [
        `The command ${rawOutcome} without satisfying the destructive-column-drop safety contract.`,
        safetyDiagnostic
          ? "A destructive-change diagnostic was present."
          : "No explicit destructive-change or data-loss diagnostic was present.",
        identifiesTable
          ? `The output identified ${tableIdentifier}.`
          : `The output did not identify ${tableIdentifier}.`,
        identifiesColumn
          ? `The output identified column ${columnIdentifier}.`
          : `The output did not identify column ${columnIdentifier}.`,
        plannedColumnDrop || safelyRefused
          ? undefined
          : "The command neither refused before generation nor produced the expected DROP COLUMN.",
      ]
        .filter(Boolean)
        .join(" ");

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
      status: safelyHandled
        ? "OK"
        : rawSync.exitCode === 0
          ? "WARNING"
          : "ERROR",
    },
    summary,
  };
}

export function assertNoOpConverged(
  rawSync: CommandResult,
  generatedMigrationFiles: GeneratedFile[],
): { result: CommandResult; summary: string } {
  const converged =
    rawSync.status === "OK" &&
    rawSync.output.includes("No schema changes found") &&
    generatedMigrationFiles.length === 0;
  const summary = converged
    ? "Identical state A and state B produced no migration."
    : [
        "The identical declaration did not satisfy the no-op convergence contract.",
        rawSync.output.includes("No schema changes found")
          ? undefined
          : 'Sync did not report "No schema changes found".',
        generatedMigrationFiles.length === 0
          ? undefined
          : `${generatedMigrationFiles.length} unexpected migration file(s) were generated.`,
      ]
        .filter(Boolean)
        .join(" ");
  return {
    result: {
      ...rawSync,
      output: [summary, rawSync.output].filter(Boolean).join("\n"),
      status: converged ? "OK" : "ERROR",
    },
    summary,
  };
}

export function assertGrantsRlsMigrationSafe(
  rawSync: CommandResult,
  generatedMigrationFiles: GeneratedFile[],
): { result: CommandResult; summary: string } {
  const generatedSql = generatedMigrationFiles.map((file) => file.content).join("\n");
  const normalizedSql = generatedSql.replaceAll('"', "").toLowerCase();
  const addsNote =
    /\balter\s+table\s+(?:only\s+)?public\.grants_rls_guard\b[\s\S]*?\badd\s+(?:column\s+)?note\b/i.test(
      normalizedSql,
    );
  const securityWeakening =
    /\b(?:revoke\b|drop\s+policy\b|disable\s+row\s+level\s+security\b|drop\s+table\b|drop\s+column\b)/i.test(
      normalizedSql,
    );
  const safe =
    rawSync.status === "OK" &&
    generatedMigrationFiles.length > 0 &&
    addsNote &&
    !securityWeakening;
  const summary = safe
    ? "The migration adds the application column without revoking grants, dropping policies, or disabling RLS."
    : [
        "The migration did not satisfy the grants/RLS preservation contract.",
        addsNote ? undefined : "The expected note column addition was missing.",
        securityWeakening ? "The migration contains a privilege or RLS weakening operation." : undefined,
      ]
        .filter(Boolean)
        .join(" ");
  return {
    result: {
      ...rawSync,
      output: [
        summary,
        rawSync.output,
        generatedSql ? `Generated migration SQL:\n${generatedSql}` : "No migration SQL was generated.",
      ]
        .filter(Boolean)
        .join("\n"),
      status: safe ? "OK" : "ERROR",
    },
    summary,
  };
}

export function assertApplicableMigrationSafe(
  rawSync: CommandResult,
  generatedMigrationFiles: GeneratedFile[],
  requiredPatterns: MigrationPatternAssertion[],
  forbiddenPatterns: MigrationPatternAssertion[],
  sensitiveValues: string[] = [],
): { result: CommandResult; summary: string } {
  const generatedSql = generatedMigrationFiles.map((file) => file.content).join("\n");
  const normalizedSql = stripSqlComments(generatedSql).replaceAll('"', "").toLowerCase();
  const normalizedOutput = `${rawSync.output}\n${generatedSql}`.toLowerCase();
  const missingPatterns = requiredPatterns
    .filter(({ pattern }) => !new RegExp(pattern, "i").test(normalizedSql))
    .map(({ description }) => description);
  const matchedForbiddenPatterns = forbiddenPatterns
    .filter(({ pattern }) => new RegExp(pattern, "i").test(normalizedSql))
    .map(({ description }) => description);
  const leakedSensitiveValues = sensitiveValues.filter((value) =>
    sensitiveRepresentations(value).some((representation) =>
      normalizedOutput.includes(representation.toLowerCase())
    ),
  );
  const safe =
    rawSync.status === "OK" &&
    generatedMigrationFiles.length > 0 &&
    missingPatterns.length === 0 &&
    matchedForbiddenPatterns.length === 0 &&
    leakedSensitiveValues.length === 0;
  const summary = safe
    ? "The generated migration matched every required SQL shape and no forbidden shape."
    : [
        "The generated migration did not satisfy its declared SQL-shape contract.",
        rawSync.status === "OK" ? undefined : `Raw sync status was ${rawSync.status}.`,
        generatedMigrationFiles.length > 0
          ? undefined
          : "No transition migration was generated.",
        missingPatterns.length > 0
          ? `Missing operation(s): ${missingPatterns.join(", ")}.`
          : undefined,
        matchedForbiddenPatterns.length > 0
          ? `Forbidden operation(s): ${matchedForbiddenPatterns.join(", ")}.`
          : undefined,
        leakedSensitiveValues.length > 0
          ? `${leakedSensitiveValues.length} declared sensitive value(s) appeared in command output or generated SQL.`
          : undefined,
      ]
        .filter(Boolean)
        .join(" ");
  return {
    result: {
      ...rawSync,
      output: [
        summary,
        rawSync.output,
        generatedSql ? `Generated migration SQL:\n${generatedSql}` : "No migration SQL was generated.",
      ]
        .filter(Boolean)
        .join("\n"),
      status: safe ? "OK" : "ERROR",
    },
    summary,
  };
}

export function assertExpectedUnsupported(
  rawSync: CommandResult,
  generatedMigrationFiles: GeneratedFile[],
  requiredPatterns: MigrationPatternAssertion[],
  forbiddenPatterns: MigrationPatternAssertion[],
  sensitiveValues: string[] = [],
): { result: CommandResult; summary: string } {
  const generatedSql = generatedMigrationFiles.map((file) => file.content).join("\n");
  const normalizedCommandOutput = rawSync.output.replaceAll('"', "").toLowerCase();
  const diagnosticText = `${rawSync.output}\n${stripSqlComments(generatedSql)}`
    .replaceAll('"', "")
    .toLowerCase();
  const missingDiagnostics = requiredPatterns
    .filter(({ pattern }) => !new RegExp(pattern, "i").test(normalizedCommandOutput))
    .map(({ description }) => description);
  const forbiddenDiagnostics = forbiddenPatterns
    .filter(({ pattern }) => new RegExp(pattern, "i").test(diagnosticText))
    .map(({ description }) => description);
  const leakedSensitiveValues = sensitiveValues.filter((value) =>
    sensitiveRepresentations(value).some((representation) =>
      diagnosticText.includes(representation.toLowerCase())
    ),
  );
  const expectedOutcome =
    (rawSync.status === "WARNING" || rawSync.status === "ERROR") &&
    missingDiagnostics.length === 0 &&
    forbiddenDiagnostics.length === 0 &&
    leakedSensitiveValues.length === 0;
  const summary = expectedOutcome
    ? "The unsupported capability produced its required stable diagnostic without destructive SQL or sensitive output."
    : [
        "The unsupported capability did not satisfy its diagnostic contract.",
        rawSync.status === "WARNING" || rawSync.status === "ERROR"
          ? undefined
          : `Raw sync unexpectedly completed with status ${rawSync.status}; promote this fixture to applicable-transition if support is intentional.`,
        missingDiagnostics.length > 0
          ? `Missing diagnostic(s): ${missingDiagnostics.join(", ")}.`
          : undefined,
        forbiddenDiagnostics.length > 0
          ? `Forbidden diagnostic or SQL shape(s): ${forbiddenDiagnostics.join(", ")}.`
          : undefined,
        leakedSensitiveValues.length > 0
          ? `${leakedSensitiveValues.length} declared sensitive value(s) leaked.`
          : undefined,
      ]
        .filter(Boolean)
        .join(" ");
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
      status: expectedOutcome ? "OK" : "ERROR",
    },
    summary,
  };
}

export function assertRecoveryMigrationSafe(
  rawSync: CommandResult,
  generatedMigrationFiles: GeneratedFile[],
): { result: CommandResult; summary: string } {
  const generatedSql = generatedMigrationFiles.map((file) => file.content).join("\n");
  const normalizedSql = generatedSql.replaceAll('"', "").toLowerCase();
  const setsNotNull =
    /\balter\s+table\s+(?:only\s+)?public\.recovery_after_failure_guard\b[\s\S]*?\balter\s+(?:column\s+)?required_later\s+set\s+not\s+null\b/i.test(
      normalizedSql,
    );
  const destructive = /\b(?:drop\s+table|drop\s+column|truncate)\b/i.test(normalizedSql);
  const safe =
    rawSync.status === "OK" &&
    generatedMigrationFiles.length > 0 &&
    setsNotNull &&
    !destructive;
  const summary = safe
    ? "The migration uses an in-place SET NOT NULL operation suitable for failure/retry testing."
    : "The generated migration did not satisfy the recovery fixture's SQL-shape contract.";
  return {
    result: {
      ...rawSync,
      output: [
        summary,
        rawSync.output,
        generatedSql ? `Generated migration SQL:\n${generatedSql}` : "No migration SQL was generated.",
      ]
        .filter(Boolean)
        .join("\n"),
      status: safe ? "OK" : "ERROR",
    },
    summary,
  };
}

export function assertDeterministicMigrationOutput(
  firstSync: CommandResult,
  firstFiles: GeneratedFile[],
  secondSync: CommandResult,
  secondFiles: GeneratedFile[],
): { result: CommandResult; summary: string } {
  const firstContents = firstFiles.map((file) => file.content);
  const secondContents = secondFiles.map((file) => file.content);
  const stable =
    firstSync.status === "OK" &&
    secondSync.status === "OK" &&
    firstContents.length > 0 &&
    firstContents.length === secondContents.length &&
    firstContents.every((content, index) => content === secondContents[index]);
  const summary = stable
    ? `Repeated generation produced ${firstContents.length} byte-identical migration file(s), ignoring timestamped filenames.`
    : [
        "Repeated generation was not deterministic.",
        `First file count: ${firstContents.length}; second file count: ${secondContents.length}.`,
      ].join(" ");
  return {
    result: {
      ...secondSync,
      output: [
        summary,
        `First sync status: ${firstSync.status}`,
        `Second sync status: ${secondSync.status}`,
        secondSync.output,
      ]
        .filter(Boolean)
        .join("\n"),
      status: stable ? "OK" : "ERROR",
    },
    summary,
  };
}

export function assertExpectedNotNullFailure(
  rawApply: CommandResult,
): { result: CommandResult; summary: string } {
  const expectedFailure =
    rawApply.status === "ERROR" &&
    /\b(?:contains?\s+null\s+values?|not-null\s+constraint|violates?\s+not-null)\b/i.test(
      rawApply.output,
    );
  const summary = expectedFailure
    ? "The first apply failed for the expected existing-NULL data hazard."
    : "The first apply did not fail with the expected existing-NULL diagnostic.";
  return {
    result: {
      ...rawApply,
      output: [summary, `Raw apply status: ${rawApply.status}`, rawApply.output]
        .filter(Boolean)
        .join("\n"),
      status: expectedFailure ? "OK" : "ERROR",
    },
    summary,
  };
}

export function assertPopulatedColumnMigrationSafe(
  rawSync: CommandResult,
  generatedMigrationFiles: GeneratedFile[],
  tableIdentifier: string,
): { result: CommandResult; summary: string } {
  const generatedSql = generatedMigrationFiles.map((file) => file.content).join("\n");
  const normalizedSql = generatedSql.replaceAll('"', "").toLowerCase();
  const escapedTable = tableIdentifier
    .toLowerCase()
    .split(".")
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join(String.raw`\s*\.\s*`);
  const alterTable = String.raw`\balter\s+table\s+(?:only\s+)?${escapedTable}\b`;
  const requiredOperations = [
    {
      description: "adds added_value",
      pattern: new RegExp(
        `${alterTable}[\\s\\S]*?\\badd\\s+(?:column\\s+)?added_value\\b`,
        "i",
      ),
    },
    {
      description: "widens widening_value to bigint",
      pattern: new RegExp(
        `${alterTable}[\\s\\S]*?\\balter\\s+(?:column\\s+)?widening_value\\s+(?:set\\s+data\\s+)?type\\s+bigint\\b`,
        "i",
      ),
    },
    {
      description: "changes the default for defaulted_value",
      pattern: new RegExp(
        `${alterTable}[\\s\\S]*?\\balter\\s+(?:column\\s+)?defaulted_value\\s+set\\s+default\\b`,
        "i",
      ),
    },
    {
      description: "sets nullable_value to NOT NULL",
      pattern: new RegExp(
        `${alterTable}[\\s\\S]*?\\balter\\s+(?:column\\s+)?nullable_value\\s+set\\s+not\\s+null\\b`,
        "i",
      ),
    },
  ];
  const missingOperations = requiredOperations
    .filter(({ pattern }) => !pattern.test(normalizedSql))
    .map(({ description }) => description);
  const forbiddenOperation = [
    /\bdrop\s+table\b/i,
    /\btruncate\b/i,
    /\bdrop\s+column\b/i,
    new RegExp(String.raw`\bcreate\s+table\s+${escapedTable}\b`, "i"),
  ].find((pattern) => pattern.test(normalizedSql));
  const safelyHandled =
    rawSync.status === "OK" &&
    generatedMigrationFiles.length > 0 &&
    missingOperations.length === 0 &&
    forbiddenOperation === undefined;
  const summary = safelyHandled
    ? "The generated migration uses in-place column alterations and contains no table/column replacement."
    : [
        "The generated migration did not satisfy the populated-column safety contract.",
        rawSync.status === "OK"
          ? undefined
          : `Raw sync status was ${rawSync.status}.`,
        generatedMigrationFiles.length > 0
          ? undefined
          : "No transition migration was generated.",
        missingOperations.length > 0
          ? `Missing operation(s): ${missingOperations.join(", ")}.`
          : undefined,
        forbiddenOperation
          ? `A forbidden destructive or replacement operation matched ${forbiddenOperation}.`
          : undefined,
      ]
        .filter(Boolean)
        .join(" ");

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

type DependencyOrderingIdentifiers = Pick<
  DependencyOrderingTransition,
  | "tableIdentifier"
  | "functionIdentifier"
  | "baseViewIdentifier"
  | "leftViewIdentifier"
  | "rightViewIdentifier"
  | "leafViewIdentifier"
>;

function normalizedQualifiedIdentifierPattern(identifier: string): string {
  return identifier
    .toLowerCase()
    .split(".")
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join(String.raw`\s*\.\s*`);
}

function creationIndex(
  normalizedSql: string,
  objectKind: "function" | "view",
  identifier: string,
): number {
  const pattern = new RegExp(
    String.raw`\bcreate\s+(?:or\s+replace\s+)?${objectKind}\s+${normalizedQualifiedIdentifierPattern(identifier)}\b`,
    "i",
  );
  return normalizedSql.search(pattern);
}

export function assertDependencyOrderingMigrationSafe(
  rawSync: CommandResult,
  generatedMigrationFiles: GeneratedFile[],
  identifiers: DependencyOrderingIdentifiers,
): { result: CommandResult; summary: string } {
  const generatedSql = generatedMigrationFiles.map((file) => file.content).join("\n");
  const normalizedSql = generatedSql.replaceAll('"', "").toLowerCase();
  const functionIndex = creationIndex(
    normalizedSql,
    "function",
    identifiers.functionIdentifier,
  );
  const baseViewIndex = creationIndex(
    normalizedSql,
    "view",
    identifiers.baseViewIdentifier,
  );
  const leftViewIndex = creationIndex(
    normalizedSql,
    "view",
    identifiers.leftViewIdentifier,
  );
  const rightViewIndex = creationIndex(
    normalizedSql,
    "view",
    identifiers.rightViewIdentifier,
  );
  const leafViewIndex = creationIndex(
    normalizedSql,
    "view",
    identifiers.leafViewIdentifier,
  );
  const creationIndexes = [
    ["function", functionIndex],
    ["base view", baseViewIndex],
    ["left view", leftViewIndex],
    ["right view", rightViewIndex],
    ["leaf view", leafViewIndex],
  ] as const;
  const missingObjects = creationIndexes
    .filter(([, index]) => index < 0)
    .map(([description]) => description);
  const dependencyOrderValid =
    functionIndex >= 0 &&
    baseViewIndex > functionIndex &&
    leftViewIndex > baseViewIndex &&
    rightViewIndex > baseViewIndex &&
    leafViewIndex > leftViewIndex &&
    leafViewIndex > rightViewIndex;
  const escapedTable = normalizedQualifiedIdentifierPattern(identifiers.tableIdentifier);
  const forbiddenOperation = [
    /\bdrop\s+(?:table|view|function)\b/i,
    /^\s*truncate\b/im,
    new RegExp(String.raw`\bcreate\s+table\s+${escapedTable}\b`, "i"),
  ].find((pattern) => pattern.test(normalizedSql));
  const safelyHandled =
    rawSync.status === "OK" &&
    generatedMigrationFiles.length > 0 &&
    missingObjects.length === 0 &&
    dependencyOrderValid &&
    forbiddenOperation === undefined;
  const summary = safelyHandled
    ? "The migration creates the function, dependency chain, and dependency diamond in topological order without replacing the populated source table."
    : [
        "The generated migration did not satisfy the dependency-ordering contract.",
        rawSync.status === "OK"
          ? undefined
          : `Raw sync status was ${rawSync.status}.`,
        generatedMigrationFiles.length > 0
          ? undefined
          : "No transition migration was generated.",
        missingObjects.length > 0
          ? `Missing object creation(s): ${missingObjects.join(", ")}.`
          : undefined,
        missingObjects.length === 0 && !dependencyOrderValid
          ? "The generated statements were not in dependency-safe topological order."
          : undefined,
        forbiddenOperation
          ? `A forbidden destructive or source-table replacement operation matched ${forbiddenOperation}.`
          : undefined,
      ]
        .filter(Boolean)
        .join(" ");

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

function jsonObjectFromQueryOutput(output: string): Record<string, unknown> | undefined {
  for (const line of output.split("\n").map((candidate) => candidate.trim()).reverse()) {
    if (!line.startsWith("{") || !line.endsWith("}")) continue;
    try {
      const parsed = JSON.parse(line) as unknown;
      if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      // Keep looking so command tags and diagnostics can coexist with the JSON result.
    }
  }
  return undefined;
}

function normalizedCatalogOid(value: unknown): string | undefined {
  if (typeof value === "number" && Number.isSafeInteger(value) && value >= 0) {
    return String(value);
  }
  return typeof value === "string" && /^\d+$/.test(value) ? value : undefined;
}

export function requirePopulatedColumnStatePreserved(
  before: CommandResult,
  after: CommandResult,
): CommandResult {
  const baseline = before.status === "OK" ? jsonObjectFromQueryOutput(before.output) : undefined;
  const desired = after.status === "OK" ? jsonObjectFromQueryOutput(after.output) : undefined;
  const baselineOid = normalizedCatalogOid(baseline?.["table_oid"]);
  const desiredOid = normalizedCatalogOid(desired?.["table_oid"]);
  const baselineValid =
    baseline?.["data_valid"] === true &&
    baseline["row_count"] === 2 &&
    baselineOid !== undefined;
  const desiredValid =
    desired?.["schema_valid"] === true &&
    desired["preserved_rows_valid"] === true &&
    desired["new_defaults_valid"] === true &&
    desired["row_count"] === 3 &&
    desiredOid !== undefined;
  const identityPreserved =
    baselineValid && desiredValid && baselineOid === desiredOid;
  const preserved = baselineValid && desiredValid && identityPreserved;
  const summary = preserved
    ? `Table OID ${String(baselineOid)} and all populated rows were preserved; new defaults also behave correctly.`
    : [
        "The populated-column post-apply state did not satisfy the preservation contract.",
        baselineValid ? undefined : "Baseline verification output was invalid.",
        desiredValid ? undefined : "Desired-state schema, row, or default verification failed.",
        baselineValid && desiredValid && !identityPreserved
          ? `Table identity changed from ${String(baselineOid)} to ${String(desiredOid)}.`
          : undefined,
      ]
        .filter(Boolean)
        .join(" ");

  return {
    ...after,
    output: [
      summary,
      `Baseline verification:\n${before.output}`,
      `Desired-state verification:\n${after.output}`,
    ].join("\n"),
    status: preserved ? "OK" : "ERROR",
  };
}

export function requireDependencyOrderingStatePreserved(
  before: CommandResult,
  after: CommandResult,
): CommandResult {
  const baseline = before.status === "OK" ? jsonObjectFromQueryOutput(before.output) : undefined;
  const desired = after.status === "OK" ? jsonObjectFromQueryOutput(after.output) : undefined;
  const baselineOid = normalizedCatalogOid(baseline?.["table_oid"]);
  const desiredOid = normalizedCatalogOid(desired?.["table_oid"]);
  const baselineValid =
    baseline?.["data_valid"] === true &&
    baseline["row_count"] === 2 &&
    baselineOid !== undefined;
  const desiredValid =
    desired?.["schema_valid"] === true &&
    desired["dependencies_valid"] === true &&
    desired["rows_valid"] === true &&
    desired["row_count"] === 3 &&
    desiredOid !== undefined;
  const identityPreserved =
    baselineValid && desiredValid && baselineOid === desiredOid;
  const preserved = baselineValid && desiredValid && identityPreserved;
  const summary = preserved
    ? `Source table OID ${String(baselineOid)}, populated rows, dependency edges, and view behavior were preserved.`
    : [
        "The dependency-ordering post-apply state did not satisfy the preservation contract.",
        baselineValid ? undefined : "Baseline verification output was invalid.",
        desiredValid
          ? undefined
          : "Desired-state schema, dependency, row, or behavior verification failed.",
        baselineValid && desiredValid && !identityPreserved
          ? `Source table identity changed from ${String(baselineOid)} to ${String(desiredOid)}.`
          : undefined,
      ]
        .filter(Boolean)
        .join(" ");

  return {
    ...after,
    output: [
      summary,
      `Baseline verification:\n${before.output}`,
      `Desired-state verification:\n${after.output}`,
    ].join("\n"),
    status: preserved ? "OK" : "ERROR",
  };
}

export function requireVerifiedStatePreserved(
  before: CommandResult,
  after: CommandResult,
  description: string,
): CommandResult {
  const baseline = before.status === "OK" ? jsonObjectFromQueryOutput(before.output) : undefined;
  const desired = after.status === "OK" ? jsonObjectFromQueryOutput(after.output) : undefined;
  const baselineIdentity = normalizedCatalogOid(baseline?.["identity"]);
  const desiredIdentity = normalizedCatalogOid(desired?.["identity"]);
  const valid =
    baseline?.["valid"] === true &&
    desired?.["valid"] === true &&
    baselineIdentity !== undefined &&
    baselineIdentity === desiredIdentity;
  const summary = valid
    ? `${description} preserved object identity ${String(baselineIdentity)} and passed all catalog/data checks.`
    : `${description} did not preserve identity or satisfy its catalog/data checks.`;
  return {
    ...after,
    output: [
      summary,
      `Baseline verification:\n${before.output}`,
      `Desired-state verification:\n${after.output}`,
    ].join("\n"),
    status: valid ? "OK" : "ERROR",
  };
}

export function requireRecoveryStateComplete(
  before: CommandResult,
  after: CommandResult,
): CommandResult {
  const baseline = before.status === "OK" ? jsonObjectFromQueryOutput(before.output) : undefined;
  const desired = after.status === "OK" ? jsonObjectFromQueryOutput(after.output) : undefined;
  const baselineOid = normalizedCatalogOid(baseline?.["table_oid"]);
  const desiredOid = normalizedCatalogOid(desired?.["table_oid"]);
  const valid =
    baseline?.["not_null"] === false &&
    desired?.["not_null"] === true &&
    desired["rows_valid"] === true &&
    baselineOid !== undefined &&
    baselineOid === desiredOid;
  const summary = valid
    ? `Recovery preserved table OID ${String(baselineOid)}, repaired invalid rows, and completed SET NOT NULL.`
    : "The recovered desired state did not satisfy identity, data, or NOT NULL checks.";
  return {
    ...after,
    output: [
      summary,
      `Baseline verification:\n${before.output}`,
      `Recovered-state verification:\n${after.output}`,
    ].join("\n"),
    status: valid ? "OK" : "ERROR",
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
