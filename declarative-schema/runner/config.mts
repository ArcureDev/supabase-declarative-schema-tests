import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import type { RunnerConfig } from "./types.mts";

export function loadRunnerConfig(scriptDirectory: string, args: string[]): RunnerConfig {
  const repositoryDirectory = resolve(scriptDirectory, "..");
  const repositoryPackagePath = join(repositoryDirectory, "package.json");
  const supabaseCliPackagePath = join(
    repositoryDirectory,
    "node_modules",
    "supabase",
    "package.json",
  );
  const supabaseCliEntry = join(
    repositoryDirectory,
    "node_modules",
    "supabase",
    "dist",
    "supabase.js",
  );
  const supabaseCliPackage = JSON.parse(readFileSync(supabaseCliPackagePath, "utf8")) as {
    version?: unknown;
  };
  if (
    typeof supabaseCliPackage.version !== "string" ||
    supabaseCliPackage.version.length === 0
  ) {
    throw new Error(
      `Unable to determine the Supabase CLI version from ${supabaseCliPackagePath}.`,
    );
  }

  const repositoryPackage = JSON.parse(readFileSync(repositoryPackagePath, "utf8")) as {
    dependencies?: Record<string, unknown>;
    devDependencies?: Record<string, unknown>;
  };
  const supabaseDependency =
    repositoryPackage.dependencies?.["supabase"] ??
    repositoryPackage.devDependencies?.["supabase"];
  const pinnedChecksum =
    typeof supabaseDependency === "string"
      ? /@([0-9a-f]{7,40})$/i.exec(supabaseDependency)?.[1]
      : undefined;
  if (!pinnedChecksum) {
    throw new Error(
      `Unable to determine the Supabase checksum from the pinned dependency in ${repositoryPackagePath}.`,
    );
  }

  const runtimeTemplateDirectory = join(scriptDirectory, "runtime");
  const runtimeConfigPath = join(runtimeTemplateDirectory, "supabase", "config.toml");
  const runtimeProjectId = /^project_id\s*=\s*"([^"]+)"$/m.exec(
    readFileSync(runtimeConfigPath, "utf8"),
  )?.[1];
  if (!runtimeProjectId) {
    throw new Error(`Unable to determine the runtime project ID from ${runtimeConfigPath}.`);
  }

  return {
    scriptDirectory,
    repositoryDirectory,
    supabaseCliEntry,
    supabaseCliVersion: supabaseCliPackage.version,
    supabaseChecksum: pinnedChecksum.slice(0, 7),
    migrationsDirectory: join(scriptDirectory, "migrations"),
    transitionsDirectory: join(scriptDirectory, "transitions"),
    runtimeTemplateDirectory,
    localDatabaseContainer: `supabase_db_${runtimeProjectId}`,
    localWorkRoot: join(scriptDirectory, ".tmp"),
    reportsDirectory: join(scriptDirectory, "reports"),
    versionsDirectory: join(scriptDirectory, "versions"),
    commandTimeoutMilliseconds: 10 * 60 * 1000,
    verbose: args.includes("--verbose"),
  };
}
