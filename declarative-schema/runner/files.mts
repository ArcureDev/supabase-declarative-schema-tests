import {
  existsSync,
  lstatSync,
  readFileSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { basename, isAbsolute, join, relative, resolve, sep } from "node:path";
import { discoverCoverageCases } from "./coverage-files.mts";
import { compareCaseNames } from "./selection.mts";
import type {
  ApplicableTransition,
  DeterministicOutputTransition,
  DependencyOrderingTransition,
  DestructiveChangeTransition,
  ExpectedUnsupportedTransition,
  GeneratedFile,
  GrantsRlsPreservationTransition,
  MigrationPatternAssertion,
  NoOpConvergenceTransition,
  PopulatedColumnTransition,
  RecoveryAfterFailureTransition,
  RenameAmbiguityTransition,
  RunnerConfig,
  SnapshotCase,
  TestCase,
  TransitionCase,
} from "./types.mts";

function requireMigrationPatterns(
  value: unknown,
  fieldName: string,
  manifestPath: string,
): MigrationPatternAssertion[] {
  if (!Array.isArray(value)) {
    throw new Error(`Invalid ${fieldName} in ${manifestPath}.`);
  }
  return value.map((candidate, index) => {
    if (
      typeof candidate !== "object" ||
      candidate === null ||
      Array.isArray(candidate)
    ) {
      throw new Error(`Invalid ${fieldName}[${index}] in ${manifestPath}.`);
    }
    const assertion = candidate as Record<string, unknown>;
    if (
      typeof assertion["description"] !== "string" ||
      assertion["description"].trim().length === 0 ||
      typeof assertion["pattern"] !== "string" ||
      assertion["pattern"].length === 0 ||
      assertion["pattern"].length > 500
    ) {
      throw new Error(`Invalid ${fieldName}[${index}] in ${manifestPath}.`);
    }
    try {
      new RegExp(assertion["pattern"], "i");
    } catch {
      throw new Error(`Invalid regular expression in ${fieldName}[${index}] in ${manifestPath}.`);
    }
    return {
      description: assertion["description"].trim(),
      pattern: assertion["pattern"],
    };
  });
}

function requireQualifiedIdentifier(
  value: unknown,
  fieldName: string,
  manifestPath: string,
): string {
  if (
    typeof value !== "string" ||
    !/^[a-z_][a-z0-9_]*\.[a-z_][a-z0-9_]*$/.test(value)
  ) {
    throw new Error(`Invalid ${fieldName} in ${manifestPath}.`);
  }
  return value;
}

export function requirePathInside(parent: string, candidate: string): void {
  const relativePath = relative(resolve(parent), resolve(candidate));
  if (
    relativePath === "" ||
    relativePath === ".." ||
    relativePath.startsWith(`..${sep}`) ||
    isAbsolute(relativePath)
  ) {
    throw new Error(`Refusing filesystem operation outside ${parent}: ${candidate}`);
  }
}

export function removeMigrationSqlFiles(workProject: string): number {
  const migrationsDirectory = join(workProject, "supabase", "migrations");
  requirePathInside(workProject, migrationsDirectory);
  if (!existsSync(migrationsDirectory)) {
    throw new Error(`Generated project has no migrations directory: ${migrationsDirectory}`);
  }
  const metadata = lstatSync(migrationsDirectory);
  if (!metadata.isDirectory() || metadata.isSymbolicLink()) {
    throw new Error(`Unsafe migrations path: ${migrationsDirectory}`);
  }

  const entries = readdirSync(migrationsDirectory, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = join(migrationsDirectory, entry.name);
    requirePathInside(migrationsDirectory, entryPath);
    if (entry.isSymbolicLink() || !entry.isFile() || !entry.name.endsWith(".sql")) {
      throw new Error(`Unexpected entry in migrations directory: ${entryPath}`);
    }
    rmSync(entryPath);
  }
  return entries.length;
}

export function captureMigrationFiles(
  workProject: string,
  excludedFileNames: Set<string> = new Set(),
): GeneratedFile[] {
  const directory = join(workProject, "supabase", "migrations");
  requirePathInside(workProject, directory);
  if (!existsSync(directory)) return [];

  const metadata = lstatSync(directory);
  if (!metadata.isDirectory() || metadata.isSymbolicLink()) {
    throw new Error(`Unsafe migrations path: ${directory}`);
  }
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => {
      if (entry.isSymbolicLink() || !entry.isFile() || !entry.name.endsWith(".sql")) {
        throw new Error(`Unexpected entry in migrations directory: ${join(directory, entry.name)}`);
      }
      return !excludedFileNames.has(entry.name);
    })
    .map((entry) => ({
      path: entry.name,
      content: readFileSync(join(directory, entry.name), "utf8").trim(),
    }))
    .sort((left, right) => left.path.localeCompare(right.path));
}

export function removeCapturedMigrationFiles(
  workProject: string,
  files: GeneratedFile[],
): number {
  const directory = join(workProject, "supabase", "migrations");
  requirePathInside(workProject, directory);
  for (const file of files) {
    if (file.path !== basename(file.path) || !file.path.endsWith(".sql")) {
      throw new Error(`Unsafe captured migration filename: ${file.path}`);
    }
    const filePath = join(directory, file.path);
    requirePathInside(directory, filePath);
    const metadata = existsSync(filePath) ? lstatSync(filePath) : undefined;
    if (!metadata?.isFile() || metadata.isSymbolicLink()) {
      throw new Error(`Captured migration is missing or unsafe: ${filePath}`);
    }
    rmSync(filePath);
  }
  return files.length;
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

function generatedSchemaDirectory(workProject: string): string {
  const directory = join(workProject, "supabase", "database");
  requirePathInside(workProject, directory);
  return directory;
}

export function captureGeneratedFiles(workProject: string): GeneratedFile[] {
  const rootDirectory = generatedSchemaDirectory(workProject);
  if (!existsSync(rootDirectory)) return [];

  const metadata = lstatSync(rootDirectory);
  if (!metadata.isDirectory() || metadata.isSymbolicLink()) {
    throw new Error(`Unsafe generated schema path: ${rootDirectory}`);
  }
  inspectDirectoryTree(rootDirectory);

  const files: GeneratedFile[] = [];
  function collectFiles(directory: string): void {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const entryPath = join(directory, entry.name);
      if (entry.isDirectory()) {
        collectFiles(entryPath);
      } else {
        files.push({
          path: relative(rootDirectory, entryPath).split(sep).join("/"),
          content: readFileSync(entryPath, "utf8").trim(),
        });
      }
    }
  }
  collectFiles(rootDirectory);
  return files.sort((left, right) => left.path.localeCompare(right.path));
}

export function removeGeneratedSchema(workProject: string): void {
  const directory = generatedSchemaDirectory(workProject);
  if (!existsSync(directory)) return;

  const metadata = lstatSync(directory);
  if (!metadata.isDirectory() || metadata.isSymbolicLink()) {
    throw new Error(`Unsafe generated schema path: ${directory}`);
  }
  inspectDirectoryTree(directory);
  rmSync(directory, { recursive: true });
}

function discoverTransitionDirectories(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.isSymbolicLink())
    .flatMap((entry) => {
      const entryDirectory = join(directory, entry.name);
      return /^\d+-/.test(entry.name) ||
        existsSync(join(entryDirectory, "transition.json"))
        ? [entryDirectory]
        : discoverTransitionDirectories(entryDirectory);
    });
}

function discoverTransitionCases(config: RunnerConfig): TransitionCase[] {
  if (!existsSync(config.transitionsDirectory)) return [];

  return discoverTransitionDirectories(config.transitionsDirectory)
    .map((directory): TransitionCase => {
      const manifestPath = join(directory, "transition.json");
      const projectDirectory = join(directory, "project");
      const projectConfigPath = join(projectDirectory, "supabase", "config.toml");
      requirePathInside(directory, projectDirectory);
      requirePathInside(projectDirectory, projectConfigPath);
      const projectMetadata = existsSync(projectDirectory)
        ? lstatSync(projectDirectory)
        : undefined;
      if (!projectMetadata?.isDirectory() || projectMetadata.isSymbolicLink()) {
        throw new Error(`Transition fixture is missing a safe project: ${projectDirectory}`);
      }
      inspectDirectoryTree(projectDirectory);
      for (const requiredPath of [manifestPath, projectConfigPath]) {
        requirePathInside(directory, requiredPath);
        const metadata = existsSync(requiredPath) ? lstatSync(requiredPath) : undefined;
        if (!metadata?.isFile() || metadata.isSymbolicLink()) {
          throw new Error(`Transition fixture is missing a safe file: ${requiredPath}`);
        }
      }

      const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
        expectation?: unknown;
        declarativeFile?: unknown;
        sourceIdentifier?: unknown;
        tableIdentifier?: unknown;
        columnIdentifier?: unknown;
        functionIdentifier?: unknown;
        baseViewIdentifier?: unknown;
        leftViewIdentifier?: unknown;
        rightViewIdentifier?: unknown;
        leafViewIdentifier?: unknown;
        description?: unknown;
        requiredMigrationPatterns?: unknown;
        forbiddenMigrationPatterns?: unknown;
        requiredDiagnosticPatterns?: unknown;
        forbiddenDiagnosticPatterns?: unknown;
        sensitiveValues?: unknown;
        requirements?: unknown;
      };
      if (
        typeof manifest.declarativeFile !== "string" ||
        !/^[a-z0-9][a-z0-9-]*\.sql$/.test(manifest.declarativeFile)
      ) {
        throw new Error(`Invalid declarativeFile in ${manifestPath}.`);
      }
      const baselinePath = join(
        projectDirectory,
        "supabase",
        "database",
        manifest.declarativeFile,
      );
      const desiredPath = join(directory, "desired", manifest.declarativeFile);
      const dataSetupPath = join(directory, "setup.sql");
      const verificationPath = join(directory, "verify.sql");
      requirePathInside(projectDirectory, baselinePath);
      for (const requiredPath of [
        baselinePath,
        desiredPath,
        dataSetupPath,
        verificationPath,
      ]) {
        requirePathInside(directory, requiredPath);
        const metadata = existsSync(requiredPath) ? lstatSync(requiredPath) : undefined;
        if (!metadata?.isFile() || metadata.isSymbolicLink()) {
          throw new Error(`Transition fixture is missing a safe file: ${requiredPath}`);
        }
      }

      const sensitiveValues =
        manifest.sensitiveValues === undefined
          ? []
          : Array.isArray(manifest.sensitiveValues) &&
              manifest.sensitiveValues.every(
                (value) =>
                  typeof value === "string" &&
                  value.length >= 8 &&
                  value.length <= 200,
              ) &&
              new Set(manifest.sensitiveValues).size === manifest.sensitiveValues.length
            ? manifest.sensitiveValues as string[]
            : undefined;
      if (sensitiveValues === undefined) {
        throw new Error(`Invalid sensitiveValues in ${manifestPath}.`);
      }
      const requirements =
        manifest.requirements === undefined
          ? []
          : Array.isArray(manifest.requirements) &&
              manifest.requirements.every(
                (value) =>
                  typeof value === "string" &&
                  /^[A-Z][A-Z0-9]*$/.test(value),
              ) &&
              new Set(manifest.requirements).size === manifest.requirements.length
            ? manifest.requirements as string[]
            : undefined;
      if (requirements === undefined) {
        throw new Error(`Invalid requirements in ${manifestPath}.`);
      }
      const fixture = {
        name: basename(directory),
        directory,
        projectDirectory,
        baselinePath,
        desiredPath,
        dataSetupPath,
        verificationPath,
        sensitiveValues,
        requirements,
      };

      if (manifest.expectation === "rename-ambiguity-warning-or-refusal") {
        if (
          typeof manifest.sourceIdentifier !== "string" ||
          !/^[a-z_][a-z0-9_]*\.[a-z_][a-z0-9_]*$/.test(manifest.sourceIdentifier)
        ) {
          throw new Error(`Invalid sourceIdentifier in ${manifestPath}.`);
        }
        return {
          ...fixture,
          kind: "rename-ambiguity-transition",
          sourceIdentifier: manifest.sourceIdentifier,
        } satisfies RenameAmbiguityTransition;
      }

      if (manifest.expectation === "populated-column-changes-preserve-data") {
        if (
          typeof manifest.tableIdentifier !== "string" ||
          !/^[a-z_][a-z0-9_]*\.[a-z_][a-z0-9_]*$/.test(manifest.tableIdentifier)
        ) {
          throw new Error(`Invalid tableIdentifier in ${manifestPath}.`);
        }
        const baselineVerificationPath = join(directory, "baseline-verify.sql");
        requirePathInside(directory, baselineVerificationPath);
        const metadata = existsSync(baselineVerificationPath)
          ? lstatSync(baselineVerificationPath)
          : undefined;
        if (!metadata?.isFile() || metadata.isSymbolicLink()) {
          throw new Error(
            `Transition fixture is missing a safe file: ${baselineVerificationPath}`,
          );
        }
        return {
          ...fixture,
          kind: "populated-column-transition",
          baselineVerificationPath,
          tableIdentifier: manifest.tableIdentifier,
        } satisfies PopulatedColumnTransition;
      }

      if (manifest.expectation === "dependency-ordering-preserved") {
        const tableIdentifier = requireQualifiedIdentifier(
          manifest.tableIdentifier,
          "tableIdentifier",
          manifestPath,
        );
        const functionIdentifier = requireQualifiedIdentifier(
          manifest.functionIdentifier,
          "functionIdentifier",
          manifestPath,
        );
        const baseViewIdentifier = requireQualifiedIdentifier(
          manifest.baseViewIdentifier,
          "baseViewIdentifier",
          manifestPath,
        );
        const leftViewIdentifier = requireQualifiedIdentifier(
          manifest.leftViewIdentifier,
          "leftViewIdentifier",
          manifestPath,
        );
        const rightViewIdentifier = requireQualifiedIdentifier(
          manifest.rightViewIdentifier,
          "rightViewIdentifier",
          manifestPath,
        );
        const leafViewIdentifier = requireQualifiedIdentifier(
          manifest.leafViewIdentifier,
          "leafViewIdentifier",
          manifestPath,
        );
        const baselineVerificationPath = join(directory, "baseline-verify.sql");
        requirePathInside(directory, baselineVerificationPath);
        const metadata = existsSync(baselineVerificationPath)
          ? lstatSync(baselineVerificationPath)
          : undefined;
        if (!metadata?.isFile() || metadata.isSymbolicLink()) {
          throw new Error(
            `Transition fixture is missing a safe file: ${baselineVerificationPath}`,
          );
        }
        return {
          ...fixture,
          kind: "dependency-ordering-transition",
          baselineVerificationPath,
          tableIdentifier,
          functionIdentifier,
          baseViewIdentifier,
          leftViewIdentifier,
          rightViewIdentifier,
          leafViewIdentifier,
        } satisfies DependencyOrderingTransition;
      }

      if (manifest.expectation === "destructive-change-warning-or-refusal") {
        if (
          typeof manifest.tableIdentifier !== "string" ||
          !/^[a-z_][a-z0-9_]*\.[a-z_][a-z0-9_]*$/.test(manifest.tableIdentifier)
        ) {
          throw new Error(`Invalid tableIdentifier in ${manifestPath}.`);
        }
        if (
          typeof manifest.columnIdentifier !== "string" ||
          !/^[a-z_][a-z0-9_]*$/.test(manifest.columnIdentifier)
        ) {
          throw new Error(`Invalid columnIdentifier in ${manifestPath}.`);
        }
        return {
          ...fixture,
          kind: "destructive-change-transition",
          tableIdentifier: manifest.tableIdentifier,
          columnIdentifier: manifest.columnIdentifier,
        } satisfies DestructiveChangeTransition;
      }

      if (manifest.expectation === "no-op-convergence") {
        return {
          ...fixture,
          kind: "no-op-convergence-transition",
        } satisfies NoOpConvergenceTransition;
      }

      if (manifest.expectation === "grants-rls-preservation") {
        const baselineVerificationPath = join(directory, "baseline-verify.sql");
        requirePathInside(directory, baselineVerificationPath);
        const metadata = existsSync(baselineVerificationPath)
          ? lstatSync(baselineVerificationPath)
          : undefined;
        if (!metadata?.isFile() || metadata.isSymbolicLink()) {
          throw new Error(
            `Transition fixture is missing a safe file: ${baselineVerificationPath}`,
          );
        }
        return {
          ...fixture,
          kind: "grants-rls-preservation-transition",
          baselineVerificationPath,
        } satisfies GrantsRlsPreservationTransition;
      }

      if (manifest.expectation === "applicable-transition") {
        if (
          typeof manifest.description !== "string" ||
          manifest.description.trim().length === 0
        ) {
          throw new Error(`Invalid description in ${manifestPath}.`);
        }
        const baselineVerificationPath = join(directory, "baseline-verify.sql");
        requirePathInside(directory, baselineVerificationPath);
        const metadata = existsSync(baselineVerificationPath)
          ? lstatSync(baselineVerificationPath)
          : undefined;
        if (!metadata?.isFile() || metadata.isSymbolicLink()) {
          throw new Error(
            `Transition fixture is missing a safe file: ${baselineVerificationPath}`,
          );
        }
        return {
          ...fixture,
          kind: "applicable-transition",
          baselineVerificationPath,
          description: manifest.description.trim(),
          requiredMigrationPatterns: requireMigrationPatterns(
            manifest.requiredMigrationPatterns,
            "requiredMigrationPatterns",
            manifestPath,
          ),
          forbiddenMigrationPatterns: requireMigrationPatterns(
            manifest.forbiddenMigrationPatterns,
            "forbiddenMigrationPatterns",
            manifestPath,
          ),
        } satisfies ApplicableTransition;
      }

      if (manifest.expectation === "expected-unsupported") {
        if (
          typeof manifest.description !== "string" ||
          manifest.description.trim().length === 0
        ) {
          throw new Error(`Invalid description in ${manifestPath}.`);
        }
        const baselineVerificationPath = join(directory, "baseline-verify.sql");
        requirePathInside(directory, baselineVerificationPath);
        const metadata = existsSync(baselineVerificationPath)
          ? lstatSync(baselineVerificationPath)
          : undefined;
        if (!metadata?.isFile() || metadata.isSymbolicLink()) {
          throw new Error(
            `Transition fixture is missing a safe file: ${baselineVerificationPath}`,
          );
        }
        return {
          ...fixture,
          kind: "expected-unsupported-transition",
          baselineVerificationPath,
          description: manifest.description.trim(),
          requiredDiagnosticPatterns: requireMigrationPatterns(
            manifest.requiredDiagnosticPatterns,
            "requiredDiagnosticPatterns",
            manifestPath,
          ),
          forbiddenDiagnosticPatterns: requireMigrationPatterns(
            manifest.forbiddenDiagnosticPatterns,
            "forbiddenDiagnosticPatterns",
            manifestPath,
          ),
        } satisfies ExpectedUnsupportedTransition;
      }

      if (manifest.expectation === "deterministic-output") {
        return {
          ...fixture,
          kind: "deterministic-output-transition",
        } satisfies DeterministicOutputTransition;
      }

      if (manifest.expectation === "recovery-after-failure") {
        const baselineVerificationPath = join(directory, "baseline-verify.sql");
        const repairPath = join(directory, "repair.sql");
        for (const requiredPath of [baselineVerificationPath, repairPath]) {
          requirePathInside(directory, requiredPath);
          const metadata = existsSync(requiredPath) ? lstatSync(requiredPath) : undefined;
          if (!metadata?.isFile() || metadata.isSymbolicLink()) {
            throw new Error(`Transition fixture is missing a safe file: ${requiredPath}`);
          }
        }
        return {
          ...fixture,
          kind: "recovery-after-failure-transition",
          baselineVerificationPath,
          repairPath,
        } satisfies RecoveryAfterFailureTransition;
      }

      throw new Error(`Unsupported transition expectation in ${manifestPath}.`);
    });
}

export function discoverCases(config: RunnerConfig): TestCase[] {
  if (!existsSync(config.migrationsDirectory)) {
    throw new Error(`Migration cases directory does not exist: ${config.migrationsDirectory}`);
  }
  const snapshots: SnapshotCase[] = readdirSync(config.migrationsDirectory, {
    withFileTypes: true,
  })
    .filter((entry) => entry.isFile() && !entry.isSymbolicLink() && entry.name.endsWith(".sql"))
    .map((entry) => ({
      kind: "snapshot",
      fileName: entry.name,
      name: entry.name.slice(0, -4),
    }));
  return [
    ...snapshots,
    ...discoverTransitionCases(config),
    ...discoverCoverageCases(config),
  ].sort((left, right) =>
    compareCaseNames(left.name, right.name),
  );
}
