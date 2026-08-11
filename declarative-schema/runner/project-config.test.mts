import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  localDatabaseContainerForProject,
  parseLocalRuntimeEndpoints,
} from "./project-config.mts";
import type { RunnerConfig } from "./types.mts";

function config(root: string): RunnerConfig {
  return {
    scriptDirectory: root,
    repositoryDirectory: root,
    supabaseCliEntry: "supabase.js",
    supabaseCliVersion: "test",
    supabaseChecksum: "abcdef0",
    migrationsDirectory: "migrations",
    transitionsDirectory: "transitions",
    coverageDirectory: "coverage",
    runtimeTemplateDirectory: "runtime",
    localDatabaseContainer: "supabase_db_fallback",
    localWorkRoot: ".tmp",
    reportsDirectory: "reports",
    versionsDirectory: "versions",
    commandTimeoutMilliseconds: 1_000,
    verbose: false,
  };
}

test("derives the database container from each work project's config", () => {
  const root = mkdtempSync(join(tmpdir(), "ds-project-config-"));
  const supabaseDirectory = join(root, "supabase");
  mkdirSync(supabaseDirectory);
  try {
    writeFileSync(
      join(supabaseDirectory, "config.toml"),
      'project_id = "case-specific"\n',
    );
    assert.equal(
      localDatabaseContainerForProject(config(root), root),
      "supabase_db_case-specific",
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("parses status JSON without depending on one key casing", () => {
  assert.deepEqual(
    parseLocalRuntimeEndpoints(
      `debug preface\n${JSON.stringify({
        api_url: "http://127.0.0.1:54321",
        anon_key: "anon",
        service_role_key: "service",
      })}`,
    ),
    {
      apiUrl: "http://127.0.0.1:54321",
      anonKey: "anon",
      serviceRoleKey: "service",
    },
  );
});
