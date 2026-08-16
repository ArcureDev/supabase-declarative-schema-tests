import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join } from "node:path";
import {
  DECLARATIVE_FILE_PATTERN,
  SCENARIO_ID_PATTERN,
  renderPackPlaceholders,
  requireCatalogueAtoms,
  requireMigrationPatterns,
  requirePathInside,
  requireQualifiedIdentifier,
  requireRelativeSafeFile,
  requireRequirements,
  requireSafeFile,
  requireSensitiveValues,
} from "./manifest-validation.mts";
import type {
  ApplicableTransition,
  DeterministicOutputTransition,
  DependencyOrderingTransition,
  DestructiveChangeTransition,
  ExpectedUnsupportedTransition,
  GrantsRlsPreservationTransition,
  NoOpConvergenceTransition,
  PopulatedColumnTransition,
  RecoveryAfterFailureTransition,
  RenameAmbiguityTransition,
  RunnerConfig,
  TransitionCase,
  TransitionFixtureBase,
} from "./types.mts";

export type ScenarioPackManifest = {
  version: 1;
  description: string;
  firstCaseNumber: number;
  comment?: string;
  sensitiveValues: string[];
  requirements: string[];
  catalogueAtoms: string[];
  scenarios: ScenarioPackScenario[];
};

export type ScenarioPackScenario = {
  id: string;
  comment?: string;
  caseNumber?: number;
  declarativeFile?: string;
  expectation: string;
  description?: string;
  catalogueAtoms: string[];
  sensitiveValues: string[];
  requirements: string[];
  sourceIdentifier?: string;
  tableIdentifier?: string;
  columnIdentifier?: string;
  functionIdentifier?: string;
  baseViewIdentifier?: string;
  leftViewIdentifier?: string;
  rightViewIdentifier?: string;
  leafViewIdentifier?: string;
  requiredMigrationPatterns?: ReturnType<typeof requireMigrationPatterns>;
  forbiddenMigrationPatterns?: ReturnType<typeof requireMigrationPatterns>;
  requiredDiagnosticPatterns?: ReturnType<typeof requireMigrationPatterns>;
  forbiddenDiagnosticPatterns?: ReturnType<typeof requireMigrationPatterns>;
};

function discoverScenarioPackDirectories(directory: string): string[] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.isSymbolicLink())
    .flatMap((entry) => {
      const child = join(directory, entry.name);
      return existsSync(join(child, "scenario-pack.json"))
        ? [child]
        : discoverScenarioPackDirectories(child);
    });
}

function inspectDirectoryTree(directory: string): void {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      throw new Error(`Refusing to inspect a symbolic link: ${entryPath}`);
    }
    if (entry.isDirectory()) {
      inspectDirectoryTree(entryPath);
    } else if (!entry.isFile()) {
      throw new Error(`Unexpected generated schema entry: ${entryPath}`);
    }
  }
}

function scenarioDirectory(packDirectory: string, id: string): string {
  return join(packDirectory, "scenarios", id);
}

function parseScenario(
  value: unknown,
  index: number,
  manifestPath: string,
  packDefaults: {
    sensitiveValues: string[];
    requirements: string[];
    catalogueAtoms: string[];
  },
): ScenarioPackScenario {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`Invalid scenarios[${index}] in ${manifestPath}.`);
  }
  const scenario = value as Record<string, unknown>;
  if (typeof scenario["id"] !== "string" || !SCENARIO_ID_PATTERN.test(scenario["id"])) {
    throw new Error(`Invalid scenarios[${index}].id in ${manifestPath}.`);
  }
  if (typeof scenario["expectation"] !== "string") {
    throw new Error(`Invalid scenarios[${index}].expectation in ${manifestPath}.`);
  }
  const declarativeFile = scenario["declarativeFile"] === undefined
    ? `${scenario["id"]}.sql`
    : scenario["declarativeFile"];
  if (typeof declarativeFile !== "string" || !DECLARATIVE_FILE_PATTERN.test(declarativeFile)) {
    throw new Error(`Invalid scenarios[${index}].declarativeFile in ${manifestPath}.`);
  }
  const caseNumber = scenario["caseNumber"];
  if (
    caseNumber !== undefined &&
    (typeof caseNumber !== "number" ||
      !Number.isInteger(caseNumber) ||
      caseNumber < 1)
  ) {
    throw new Error(`Invalid scenarios[${index}].caseNumber in ${manifestPath}.`);
  }
  const comment = scenario["comment"];
  if (comment !== undefined && typeof comment !== "string") {
    throw new Error(`Invalid scenarios[${index}].comment in ${manifestPath}.`);
  }
  const description = scenario["description"];
  if (description !== undefined && typeof description !== "string") {
    throw new Error(`Invalid scenarios[${index}].description in ${manifestPath}.`);
  }
  const scenarioCatalogueAtoms = requireCatalogueAtoms(
    scenario["catalogueAtoms"] === undefined ? [] : scenario["catalogueAtoms"],
    `${manifestPath} scenarios[${index}]`,
  );
  const catalogueAtoms = [...new Set([
    ...packDefaults.catalogueAtoms,
    ...scenarioCatalogueAtoms,
  ])];
  if (catalogueAtoms.length === 0) {
    throw new Error(
      `scenarios[${index}] in ${manifestPath} must declare catalogueAtoms.`,
    );
  }
  return {
    id: scenario["id"],
    ...(typeof comment === "string" ? { comment } : {}),
    ...(typeof caseNumber === "number" ? { caseNumber } : {}),
    declarativeFile,
    expectation: scenario["expectation"],
    ...(typeof description === "string" ? { description: description.trim() } : {}),
    catalogueAtoms,
    sensitiveValues: [
      ...packDefaults.sensitiveValues,
      ...requireSensitiveValues(
        scenario["sensitiveValues"],
        `${manifestPath} scenarios[${index}]`,
      ),
    ],
    requirements: [
      ...packDefaults.requirements,
      ...requireRequirements(
        scenario["requirements"],
        `${manifestPath} scenarios[${index}]`,
      ),
    ],
    ...(typeof scenario["sourceIdentifier"] === "string"
      ? { sourceIdentifier: scenario["sourceIdentifier"] }
      : {}),
    ...(typeof scenario["tableIdentifier"] === "string"
      ? { tableIdentifier: scenario["tableIdentifier"] }
      : {}),
    ...(typeof scenario["columnIdentifier"] === "string"
      ? { columnIdentifier: scenario["columnIdentifier"] }
      : {}),
    ...(typeof scenario["functionIdentifier"] === "string"
      ? { functionIdentifier: scenario["functionIdentifier"] }
      : {}),
    ...(typeof scenario["baseViewIdentifier"] === "string"
      ? { baseViewIdentifier: scenario["baseViewIdentifier"] }
      : {}),
    ...(typeof scenario["leftViewIdentifier"] === "string"
      ? { leftViewIdentifier: scenario["leftViewIdentifier"] }
      : {}),
    ...(typeof scenario["rightViewIdentifier"] === "string"
      ? { rightViewIdentifier: scenario["rightViewIdentifier"] }
      : {}),
    ...(typeof scenario["leafViewIdentifier"] === "string"
      ? { leafViewIdentifier: scenario["leafViewIdentifier"] }
      : {}),
    ...(scenario["requiredMigrationPatterns"] !== undefined
      ? {
          requiredMigrationPatterns: requireMigrationPatterns(
            scenario["requiredMigrationPatterns"],
            `scenarios[${index}].requiredMigrationPatterns`,
            manifestPath,
          ),
        }
      : {}),
    ...(scenario["forbiddenMigrationPatterns"] !== undefined
      ? {
          forbiddenMigrationPatterns: requireMigrationPatterns(
            scenario["forbiddenMigrationPatterns"],
            `scenarios[${index}].forbiddenMigrationPatterns`,
            manifestPath,
          ),
        }
      : {}),
    ...(scenario["requiredDiagnosticPatterns"] !== undefined
      ? {
          requiredDiagnosticPatterns: requireMigrationPatterns(
            scenario["requiredDiagnosticPatterns"],
            `scenarios[${index}].requiredDiagnosticPatterns`,
            manifestPath,
          ),
        }
      : {}),
    ...(scenario["forbiddenDiagnosticPatterns"] !== undefined
      ? {
          forbiddenDiagnosticPatterns: requireMigrationPatterns(
            scenario["forbiddenDiagnosticPatterns"],
            `scenarios[${index}].forbiddenDiagnosticPatterns`,
            manifestPath,
          ),
        }
      : {}),
  };
}

export function parseScenarioPackManifest(
  manifestPath: string,
): ScenarioPackManifest {
  const parsed = JSON.parse(readFileSync(manifestPath, "utf8")) as Record<
    string,
    unknown
  >;
  if (parsed["version"] !== 1) {
    throw new Error(`Unsupported scenario-pack version in ${manifestPath}.`);
  }
  if (
    typeof parsed["description"] !== "string" ||
    parsed["description"].trim().length === 0
  ) {
    throw new Error(`Invalid description in ${manifestPath}.`);
  }
  if (
    typeof parsed["firstCaseNumber"] !== "number" ||
    !Number.isInteger(parsed["firstCaseNumber"]) ||
    parsed["firstCaseNumber"] < 1
  ) {
    throw new Error(`Invalid firstCaseNumber in ${manifestPath}.`);
  }
  if (!Array.isArray(parsed["scenarios"]) || parsed["scenarios"].length === 0) {
    throw new Error(`Scenario pack has no scenarios: ${manifestPath}.`);
  }
  const comment = parsed["comment"];
  if (comment !== undefined && typeof comment !== "string") {
    throw new Error(`Invalid comment in ${manifestPath}.`);
  }
  const packDefaults = {
    sensitiveValues: requireSensitiveValues(parsed["sensitiveValues"], manifestPath),
    requirements: requireRequirements(parsed["requirements"], manifestPath),
    catalogueAtoms: requireCatalogueAtoms(parsed["catalogueAtoms"], manifestPath),
  };
  const scenarios = parsed["scenarios"].map((scenario, index) =>
    parseScenario(scenario, index, manifestPath, packDefaults),
  );
  const seenIds = new Set<string>();
  for (const scenario of scenarios) {
    if (seenIds.has(scenario.id)) {
      throw new Error(`Duplicate scenario id ${scenario.id} in ${manifestPath}.`);
    }
    seenIds.add(scenario.id);
  }
  return {
    version: 1,
    description: parsed["description"].trim(),
    firstCaseNumber: parsed["firstCaseNumber"],
    ...(typeof comment === "string" ? { comment } : {}),
    sensitiveValues: packDefaults.sensitiveValues,
    requirements: packDefaults.requirements,
    catalogueAtoms: packDefaults.catalogueAtoms,
    scenarios,
  };
}

function requireScenarioSql(
  packDirectory: string,
  scenario: ScenarioPackScenario,
  fileName: string,
): string {
  return requireRelativeSafeFile(
    packDirectory,
    join("scenarios", scenario.id, fileName),
  );
}

function expandScenario(
  packDirectory: string,
  pack: ScenarioPackManifest,
  scenario: ScenarioPackScenario,
  index: number,
): TransitionCase {
  const manifestPath = join(packDirectory, "scenario-pack.json");
  const caseNumber = scenario.caseNumber ?? pack.firstCaseNumber + index;
  if (caseNumber !== pack.firstCaseNumber + index) {
    throw new Error(
      `Scenario ${scenario.id} in ${manifestPath} must use contiguous case number ${pack.firstCaseNumber + index}.`,
    );
  }
  const projectDirectory = join(packDirectory, "project");
  const scenarioRoot = scenarioDirectory(packDirectory, scenario.id);
  const declarativeFile = scenario.declarativeFile ?? `${scenario.id}.sql`;
  const baselinePath = requireScenarioSql(packDirectory, scenario, "baseline.sql");
  const desiredPath = requireScenarioSql(packDirectory, scenario, "desired.sql");
  const dataSetupPath = requireScenarioSql(packDirectory, scenario, "setup.sql");
  const verificationPath = requireScenarioSql(packDirectory, scenario, "verify.sql");
  const fixture: TransitionFixtureBase = {
    name: `${caseNumber}-${scenario.id}`,
    directory: packDirectory,
    projectDirectory,
    baselinePath,
    desiredPath,
    dataSetupPath,
    verificationPath,
    sensitiveValues: [...new Set(scenario.sensitiveValues)],
    requirements: [...new Set(scenario.requirements)],
    catalogueAtoms: scenario.catalogueAtoms,
    declarativeFile,
    packDirectory,
    packScenarioId: scenario.id,
    packDescription: pack.description,
  };

  if (scenario.expectation === "rename-ambiguity-warning-or-refusal") {
    return {
      ...fixture,
      kind: "rename-ambiguity-transition",
      sourceIdentifier: requireQualifiedIdentifier(
        scenario.sourceIdentifier,
        `scenarios[${index}].sourceIdentifier`,
        manifestPath,
      ),
    } satisfies RenameAmbiguityTransition;
  }
  if (scenario.expectation === "populated-column-changes-preserve-data") {
    return {
      ...fixture,
      kind: "populated-column-transition",
      baselineVerificationPath: requireScenarioSql(
        packDirectory,
        scenario,
        "baseline-verify.sql",
      ),
      tableIdentifier: requireQualifiedIdentifier(
        scenario.tableIdentifier,
        `scenarios[${index}].tableIdentifier`,
        manifestPath,
      ),
    } satisfies PopulatedColumnTransition;
  }
  if (scenario.expectation === "dependency-ordering-preserved") {
    return {
      ...fixture,
      kind: "dependency-ordering-transition",
      baselineVerificationPath: requireScenarioSql(
        packDirectory,
        scenario,
        "baseline-verify.sql",
      ),
      tableIdentifier: requireQualifiedIdentifier(
        scenario.tableIdentifier,
        `scenarios[${index}].tableIdentifier`,
        manifestPath,
      ),
      functionIdentifier: requireQualifiedIdentifier(
        scenario.functionIdentifier,
        `scenarios[${index}].functionIdentifier`,
        manifestPath,
      ),
      baseViewIdentifier: requireQualifiedIdentifier(
        scenario.baseViewIdentifier,
        `scenarios[${index}].baseViewIdentifier`,
        manifestPath,
      ),
      leftViewIdentifier: requireQualifiedIdentifier(
        scenario.leftViewIdentifier,
        `scenarios[${index}].leftViewIdentifier`,
        manifestPath,
      ),
      rightViewIdentifier: requireQualifiedIdentifier(
        scenario.rightViewIdentifier,
        `scenarios[${index}].rightViewIdentifier`,
        manifestPath,
      ),
      leafViewIdentifier: requireQualifiedIdentifier(
        scenario.leafViewIdentifier,
        `scenarios[${index}].leafViewIdentifier`,
        manifestPath,
      ),
    } satisfies DependencyOrderingTransition;
  }
  if (scenario.expectation === "destructive-change-warning-or-refusal") {
    if (
      typeof scenario.columnIdentifier !== "string" ||
      !/^[a-z_][a-z0-9_]*$/.test(scenario.columnIdentifier)
    ) {
      throw new Error(
        `Invalid scenarios[${index}].columnIdentifier in ${manifestPath}.`,
      );
    }
    return {
      ...fixture,
      kind: "destructive-change-transition",
      tableIdentifier: requireQualifiedIdentifier(
        scenario.tableIdentifier,
        `scenarios[${index}].tableIdentifier`,
        manifestPath,
      ),
      columnIdentifier: scenario.columnIdentifier,
    } satisfies DestructiveChangeTransition;
  }
  if (scenario.expectation === "no-op-convergence") {
    return {
      ...fixture,
      kind: "no-op-convergence-transition",
    } satisfies NoOpConvergenceTransition;
  }
  if (scenario.expectation === "grants-rls-preservation") {
    return {
      ...fixture,
      kind: "grants-rls-preservation-transition",
      baselineVerificationPath: requireScenarioSql(
        packDirectory,
        scenario,
        "baseline-verify.sql",
      ),
    } satisfies GrantsRlsPreservationTransition;
  }
  if (scenario.expectation === "applicable-transition") {
    if (!scenario.description) {
      throw new Error(`Invalid scenarios[${index}].description in ${manifestPath}.`);
    }
    const requiredMigrationPatterns = scenario.requiredMigrationPatterns ?? [];
    const forbiddenMigrationPatterns = scenario.forbiddenMigrationPatterns ?? [];
    if (
      requiredMigrationPatterns.length === 0 ||
      forbiddenMigrationPatterns.length === 0
    ) {
      throw new Error(
        `scenarios[${index}] in ${manifestPath} must declare required and forbidden migration patterns.`,
      );
    }
    return {
      ...fixture,
      kind: "applicable-transition",
      baselineVerificationPath: requireScenarioSql(
        packDirectory,
        scenario,
        "baseline-verify.sql",
      ),
      description: scenario.description,
      requiredMigrationPatterns,
      forbiddenMigrationPatterns,
    } satisfies ApplicableTransition;
  }
  if (scenario.expectation === "expected-unsupported") {
    if (!scenario.description) {
      throw new Error(`Invalid scenarios[${index}].description in ${manifestPath}.`);
    }
    const requiredDiagnosticPatterns = scenario.requiredDiagnosticPatterns ?? [];
    const forbiddenDiagnosticPatterns = scenario.forbiddenDiagnosticPatterns ?? [];
    if (
      requiredDiagnosticPatterns.length === 0 ||
      forbiddenDiagnosticPatterns.length === 0
    ) {
      throw new Error(
        `scenarios[${index}] in ${manifestPath} must declare required and forbidden diagnostic patterns.`,
      );
    }
    return {
      ...fixture,
      kind: "expected-unsupported-transition",
      baselineVerificationPath: requireScenarioSql(
        packDirectory,
        scenario,
        "baseline-verify.sql",
      ),
      description: scenario.description,
      requiredDiagnosticPatterns,
      forbiddenDiagnosticPatterns,
    } satisfies ExpectedUnsupportedTransition;
  }
  if (scenario.expectation === "deterministic-output") {
    return {
      ...fixture,
      kind: "deterministic-output-transition",
    } satisfies DeterministicOutputTransition;
  }
  if (scenario.expectation === "recovery-after-failure") {
    requireScenarioSql(packDirectory, scenario, "repair.sql");
    return {
      ...fixture,
      kind: "recovery-after-failure-transition",
      baselineVerificationPath: requireScenarioSql(
        packDirectory,
        scenario,
        "baseline-verify.sql",
      ),
      repairPath: join(scenarioRoot, "repair.sql"),
    } satisfies RecoveryAfterFailureTransition;
  }
  throw new Error(
    `Unsupported transition expectation in ${manifestPath} scenarios[${index}].`,
  );
}

export function expandScenarioPack(
  packDirectory: string,
  pack: ScenarioPackManifest,
): TransitionCase[] {
  const projectDirectory = join(packDirectory, "project");
  const projectConfigPath = join(projectDirectory, "supabase", "config.toml");
  requirePathInside(packDirectory, projectDirectory);
  const projectMetadata = existsSync(projectDirectory)
    ? lstatSync(projectDirectory)
    : undefined;
  if (!projectMetadata?.isDirectory() || projectMetadata.isSymbolicLink()) {
    throw new Error(`Scenario pack is missing a safe project: ${projectDirectory}`);
  }
  inspectDirectoryTree(projectDirectory);
  requireSafeFile(packDirectory, projectConfigPath);
  if (existsSync(join(packDirectory, "transition.json"))) {
    throw new Error(
      `Scenario pack ${packDirectory} cannot also contain transition.json.`,
    );
  }
  return pack.scenarios.map((scenario, index) =>
    expandScenario(packDirectory, pack, scenario, index),
  );
}

export function discoverScenarioPackCases(config: RunnerConfig): TransitionCase[] {
  if (!existsSync(config.transitionsDirectory)) return [];
  return discoverScenarioPackDirectories(config.transitionsDirectory).flatMap(
    (directory) => {
      const manifestPath = join(directory, "scenario-pack.json");
      const pack = parseScenarioPackManifest(manifestPath);
      return expandScenarioPack(directory, pack);
    },
  );
}

export function workDeclarationPath(
  testCase: TransitionFixtureBase,
  workProject: string,
): string {
  return join(workProject, "supabase", "database", testCase.declarativeFile);
}

export function materializePackDeclaration(
  testCase: TransitionFixtureBase,
  workProject: string,
  sourcePath: string,
): void {
  const destination = workDeclarationPath(testCase, workProject);
  requirePathInside(workProject, destination);
  mkdirSync(dirname(destination), { recursive: true });
  const placeholders = {
    id: testCase.packScenarioId ?? basename(testCase.name),
    caseNumber: testCase.name.replace(/-.*$/, ""),
    slug: testCase.name.replace(/^\d+-/, ""),
    declarativeFile: testCase.declarativeFile,
  };
  const rendered = renderPackPlaceholders(
    readFileSync(sourcePath, "utf8"),
    placeholders,
  );
  writeFileSync(destination, rendered);
}

export function readFixtureSql(
  testCase: TransitionFixtureBase,
  sourcePath: string,
): string {
  const placeholders = {
    id: testCase.packScenarioId ?? basename(testCase.name),
    caseNumber: testCase.name.replace(/-.*$/, ""),
    slug: testCase.name.replace(/^\d+-/, ""),
    declarativeFile: testCase.declarativeFile,
  };
  const raw = readFileSync(sourcePath, "utf8");
  return testCase.packScenarioId
    ? renderPackPlaceholders(raw, placeholders).trim()
    : raw.trim();
}
