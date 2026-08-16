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
import { discoverCases } from "./files.mts";
import {
  discoverScenarioPackCases,
  parseScenarioPackManifest,
  readFixtureSql,
} from "./scenario-pack-files.mts";
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

function writePack(root: string): string {
  const packDirectory = join(
    root,
    "declarative-schema",
    "transitions",
    "catalogue",
    "298-column-pack",
  );
  mkdirSync(join(packDirectory, "project", "supabase", "database"), {
    recursive: true,
  });
  mkdirSync(join(packDirectory, "scenarios", "int2-to-int4"), { recursive: true });
  mkdirSync(join(packDirectory, "scenarios", "drop-populated-column"), {
    recursive: true,
  });
  writeFileSync(
    join(packDirectory, "project", "supabase", "config.toml"),
    'project_id = "ds-shared-runtime"\n',
  );
  writeFileSync(
    join(packDirectory, "project", "supabase", "database", "extensions.sql"),
    "select 1;\n",
  );
  for (const id of ["int2-to-int4", "drop-populated-column"]) {
    for (const file of ["baseline.sql", "desired.sql", "setup.sql", "verify.sql"]) {
      writeFileSync(
        join(packDirectory, "scenarios", id, file),
        file === "verify.sql"
          ? "select jsonb_build_object('identity', 1, 'valid', true);\n"
          : "select 1;\n",
      );
    }
    writeFileSync(
      join(packDirectory, "scenarios", id, "baseline-verify.sql"),
      "select jsonb_build_object('identity', 1, 'valid', true);\n",
    );
  }
  writeFileSync(
    join(packDirectory, "scenario-pack.json"),
    JSON.stringify({
      version: 1,
      description: "column type evolution",
      firstCaseNumber: 298,
      comment: "Shared project template with per-scenario A/B SQL.",
      scenarios: [
        {
          id: "int2-to-int4",
          expectation: "applicable-transition",
          description: "widen int2 to int4",
          catalogueAtoms: ["PG-CAT-STC-04::cast.implicit"],
          requiredMigrationPatterns: [
            { description: "alters the column type", pattern: "\\balter\\s+table\\b" },
          ],
          forbiddenMigrationPatterns: [
            { description: "does not drop the anchor", pattern: "\\bdrop\\s+table\\b" },
          ],
        },
        {
          id: "drop-populated-column",
          expectation: "destructive-change-warning-or-refusal",
          catalogueAtoms: ["PG-CAT-STC-03::drop.column@populated"],
          tableIdentifier: "public.accounts",
          columnIdentifier: "legacy_flag",
        },
      ],
    }),
  );
  return packDirectory;
}

test("discovers and expands a mixed-expectation scenario pack", () => {
  const root = mkdtempSync(join(tmpdir(), "ds-scenario-pack-"));
  try {
    writePack(root);
    const cases = discoverScenarioPackCases(config(root));
    assert.equal(cases.length, 2);
    assert.equal(cases[0]?.name, "298-int2-to-int4");
    assert.equal(cases[0]?.kind, "applicable-transition");
    assert.equal(cases[0]?.packScenarioId, "int2-to-int4");
    assert.equal(cases[0]?.declarativeFile, "int2-to-int4.sql");
    assert.deepEqual(cases[0]?.catalogueAtoms, ["PG-CAT-STC-04::cast.implicit"]);
    assert.equal(cases[1]?.name, "299-drop-populated-column");
    assert.equal(cases[1]?.kind, "destructive-change-transition");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("rejects a pack directory that also has transition.json", () => {
  const root = mkdtempSync(join(tmpdir(), "ds-scenario-pack-dup-"));
  try {
    const packDirectory = writePack(root);
    writeFileSync(join(packDirectory, "transition.json"), "{}");
    assert.throws(
      () => discoverScenarioPackCases(config(root)),
      /cannot also contain transition\.json/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("rejects unknown placeholders and path escapes", () => {
  const root = mkdtempSync(join(tmpdir(), "ds-scenario-pack-escape-"));
  try {
    const packDirectory = writePack(root);
    const manifest = parseScenarioPackManifest(
      join(packDirectory, "scenario-pack.json"),
    );
    assert.equal(manifest.firstCaseNumber, 298);
    writeFileSync(
      join(packDirectory, "scenarios", "int2-to-int4", "baseline.sql"),
      "{{unknown}}\n",
    );
    const cases = discoverScenarioPackCases(config(root));
    const applicable = cases[0];
    assert.ok(applicable);
    assert.throws(
      () => readFixtureSql(applicable, applicable.baselinePath),
      /Unknown pack placeholder/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("discoverCases does not double-count a scenario pack as a transition.json fixture", () => {
  const root = mkdtempSync(join(tmpdir(), "ds-scenario-pack-discover-"));
  try {
    writePack(root);
    mkdirSync(join(root, "declarative-schema", "migrations"), { recursive: true });
    mkdirSync(join(root, "declarative-schema", "coverage"), { recursive: true });
    const cases = discoverCases(config(root));
    assert.equal(cases.length, 2);
    assert.deepEqual(
      cases.map((fixture) => fixture.name),
      ["298-int2-to-int4", "299-drop-populated-column"],
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
