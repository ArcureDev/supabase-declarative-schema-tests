import {
  existsSync,
  lstatSync,
  readFileSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { compareCaseNames } from "./selection.mts";
import type {
  GeneratedFile,
  RenameAmbiguityTransition,
  RunnerConfig,
  SnapshotCase,
  TestCase,
} from "./types.mts";

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

function discoverTransitionCases(config: RunnerConfig): RenameAmbiguityTransition[] {
  if (!existsSync(config.transitionsDirectory)) return [];

  return readdirSync(config.transitionsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.isSymbolicLink())
    .map((entry): RenameAmbiguityTransition => {
      const directory = join(config.transitionsDirectory, entry.name);
      const manifestPath = join(directory, "transition.json");
      const baselinePath = join(directory, "schema-a.sql");
      const desiredPath = join(directory, "schema-b.sql");
      const extensionsPath = join(directory, "extensions.sql");
      const dataSetupPath = join(directory, "setup.sql");
      const verificationPath = join(directory, "verify.sql");
      for (const requiredPath of [
        manifestPath,
        baselinePath,
        desiredPath,
        extensionsPath,
        dataSetupPath,
        verificationPath,
      ]) {
        requirePathInside(directory, requiredPath);
        const metadata = existsSync(requiredPath) ? lstatSync(requiredPath) : undefined;
        if (!metadata?.isFile() || metadata.isSymbolicLink()) {
          throw new Error(`Transition fixture is missing a safe file: ${requiredPath}`);
        }
      }

      const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
        expectation?: unknown;
        sourceIdentifier?: unknown;
      };
      if (manifest.expectation !== "rename-ambiguity-warning-or-refusal") {
        throw new Error(`Unsupported transition expectation in ${manifestPath}.`);
      }
      if (
        typeof manifest.sourceIdentifier !== "string" ||
        !/^[a-z_][a-z0-9_]*\.[a-z_][a-z0-9_]*$/.test(manifest.sourceIdentifier)
      ) {
        throw new Error(`Invalid sourceIdentifier in ${manifestPath}.`);
      }
      return {
        kind: "rename-ambiguity-transition",
        name: entry.name,
        directory,
        baselinePath,
        desiredPath,
        extensionsPath,
        dataSetupPath,
        verificationPath,
        sourceIdentifier: manifest.sourceIdentifier,
      };
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
  return [...snapshots, ...discoverTransitionCases(config)].sort((left, right) =>
    compareCaseNames(left.name, right.name),
  );
}
