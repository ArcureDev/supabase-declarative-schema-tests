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
import { discoverCoverageCases } from "./coverage-files.mts";
import type { RunnerConfig } from "./types.mts";

function config(root: string): RunnerConfig {
  const scriptDirectory = join(root, "declarative-schema");
  return {
    scriptDirectory,
    repositoryDirectory: root,
    supabaseCliEntry: "supabase.js",
    supabaseCliVersion: "test",
    supabaseChecksum: "abcdef0",
    migrationsDirectory: join(scriptDirectory, "migrations"),
    transitionsDirectory: join(scriptDirectory, "transitions"),
    coverageDirectory: join(scriptDirectory, "coverage"),
    runtimeTemplateDirectory: join(scriptDirectory, "runtime"),
    localDatabaseContainer: "supabase_db_test",
    localWorkRoot: join(scriptDirectory, ".tmp"),
    reportsDirectory: join(scriptDirectory, "reports"),
    versionsDirectory: join(scriptDirectory, "versions"),
    commandTimeoutMilliseconds: 1_000,
    verbose: false,
  };
}

test("discovers and validates an ordered multi-plane coverage case", () => {
  const root = mkdtempSync(join(tmpdir(), "ds-coverage-files-"));
  const runnerConfig = config(root);
  const caseDirectory = join(
    runnerConfig.coverageDirectory,
    "service",
    "245-http-boundary",
  );
  mkdirSync(join(caseDirectory, "project", "supabase"), { recursive: true });
  try {
    writeFileSync(
      join(caseDirectory, "project", "supabase", "config.toml"),
      'project_id = "test"\n',
    );
    writeFileSync(join(caseDirectory, "setup.sql"), "select 1;\n");
    writeFileSync(
      join(caseDirectory, "coverage.json"),
      JSON.stringify({
        description: "exercise a local API boundary",
        plane: "service",
        requirements: ["M1"],
        phases: [
          {
            id: "version",
            title: "Version",
            kind: "supabase",
            engine: "legacy",
            args: ["--version"],
          },
          {
            id: "setup",
            title: "Setup",
            kind: "sql",
            file: "setup.sql",
            dependsOn: ["version"],
          },
          {
            id: "status",
            title: "Status",
            kind: "runtime-status",
            dependsOn: ["setup"],
          },
          {
            id: "request",
            title: "Request",
            kind: "http",
            dependsOn: ["status"],
            request: {
              description: "read API",
              method: "GET",
              path: "/rest/v1/items",
              credential: "anon",
              expectedStatus: 200,
            },
          },
        ],
      }),
    );

    const cases = discoverCoverageCases(runnerConfig);
    assert.equal(cases.length, 1);
    assert.equal(cases[0]?.name, "245-http-boundary");
    assert.equal(cases[0]?.plane, "service");
    assert.deepEqual(cases[0]?.requirements, ["M1"]);
    assert.deepEqual(
      cases[0]?.phases.map((phase) => phase.kind),
      ["supabase", "sql", "runtime-status", "http"],
    );
    const firstPhase = cases[0]?.phases[0];
    assert.equal(firstPhase?.kind, "supabase");
    if (firstPhase?.kind !== "supabase") assert.fail("Expected a Supabase phase.");
    assert.equal(firstPhase.engine, "legacy");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
