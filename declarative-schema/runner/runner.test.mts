import assert from "node:assert/strict";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { describeCommandFailure } from "./commands.mts";
import { discoverCases } from "./files.mts";
import { renderReport, writeReport } from "./reporting.mts";
import type {
  CommandResult,
  ProjectResult,
  RunnerConfig,
} from "./types.mts";
import { updateVersionReportsFromReports } from "./versions.mts";

function command(
  status: CommandResult["status"] = "OK",
  output = "",
): CommandResult {
  return {
    command: "npx supabase example",
    durationMilliseconds: 100,
    exitCode: status === "SKIPPED" ? null : status === "ERROR" ? 1 : 0,
    output,
    status,
  };
}

function testConfig(root: string): RunnerConfig {
  const scriptDirectory = join(root, "declarative-schema");
  return {
    scriptDirectory,
    repositoryDirectory: root,
    supabaseCliEntry: join(root, "supabase.js"),
    supabaseCliVersion: "1.2.3",
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

test("describes runner checks separately from successful command exits", () => {
  const result = command("ERROR", "Missing destructive-change warning.");
  result.exitCode = 0;

  assert.equal(
    describeCommandFailure(result),
    "The command exited successfully, but the runner check failed.",
  );
});

test("discovers a transition from its self-contained Supabase project", () => {
  const root = mkdtempSync(join(tmpdir(), "ds-runner-transition-"));
  const config = testConfig(root);
  const caseDirectory = join(config.transitionsDirectory, "181-rename-ambiguity");
  const projectDirectory = join(caseDirectory, "project");
  const databaseDirectory = join(projectDirectory, "supabase", "database");
  const desiredDirectory = join(caseDirectory, "desired");
  mkdirSync(config.migrationsDirectory, { recursive: true });
  mkdirSync(databaseDirectory, { recursive: true });
  mkdirSync(desiredDirectory, { recursive: true });

  try {
    writeFileSync(
      join(caseDirectory, "transition.json"),
      JSON.stringify({
        expectation: "rename-ambiguity-warning-or-refusal",
        declarativeFile: "rename-ambiguity.sql",
        sourceIdentifier: "public.rename_ambiguity_source",
      }),
    );
    writeFileSync(join(projectDirectory, "supabase", "config.toml"), 'project_id = "test"\n');
    writeFileSync(
      join(databaseDirectory, "rename-ambiguity.sql"),
      "create table public.rename_ambiguity_source(id bigint primary key);\n",
    );
    writeFileSync(
      join(desiredDirectory, "rename-ambiguity.sql"),
      "create table public.rename_ambiguity_target(id bigint primary key);\n",
    );
    writeFileSync(join(caseDirectory, "setup.sql"), "select 1;\n");
    writeFileSync(join(caseDirectory, "verify.sql"), "select 1;\n");

    const cases = discoverCases(config);
    assert.equal(cases.length, 1);
    const transition = cases[0];
    assert.equal(transition?.kind, "rename-ambiguity-transition");
    if (transition?.kind !== "rename-ambiguity-transition") {
      assert.fail("Expected a rename-ambiguity transition.");
    }
    assert.equal(transition.projectDirectory, projectDirectory);
    assert.equal(
      transition.baselinePath,
      join(databaseDirectory, "rename-ambiguity.sql"),
    );
    assert.equal(
      transition.desiredPath,
      join(desiredDirectory, "rename-ambiguity.sql"),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("discovers a populated-column transition and both verification queries", () => {
  const root = mkdtempSync(join(tmpdir(), "ds-runner-populated-column-"));
  const config = testConfig(root);
  const caseDirectory = join(config.transitionsDirectory, "182-populated-column-changes");
  const projectDirectory = join(caseDirectory, "project");
  const databaseDirectory = join(projectDirectory, "supabase", "database");
  const desiredDirectory = join(caseDirectory, "desired");
  mkdirSync(config.migrationsDirectory, { recursive: true });
  mkdirSync(databaseDirectory, { recursive: true });
  mkdirSync(desiredDirectory, { recursive: true });

  try {
    writeFileSync(
      join(caseDirectory, "transition.json"),
      JSON.stringify({
        expectation: "populated-column-changes-preserve-data",
        declarativeFile: "populated-column-changes.sql",
        tableIdentifier: "public.populated_column_changes",
      }),
    );
    writeFileSync(join(projectDirectory, "supabase", "config.toml"), 'project_id = "test"\n');
    writeFileSync(
      join(databaseDirectory, "populated-column-changes.sql"),
      "create table public.populated_column_changes(id bigint primary key);\n",
    );
    writeFileSync(
      join(desiredDirectory, "populated-column-changes.sql"),
      "create table public.populated_column_changes(id bigint primary key, value text);\n",
    );
    writeFileSync(join(caseDirectory, "setup.sql"), "select 1;\n");
    writeFileSync(join(caseDirectory, "baseline-verify.sql"), "select 1;\n");
    writeFileSync(join(caseDirectory, "verify.sql"), "select 1;\n");

    const transition = discoverCases(config)[0];
    assert.equal(transition?.kind, "populated-column-transition");
    if (transition?.kind !== "populated-column-transition") {
      assert.fail("Expected a populated-column transition.");
    }
    assert.equal(
      transition.baselineVerificationPath,
      join(caseDirectory, "baseline-verify.sql"),
    );
    assert.equal(transition.tableIdentifier, "public.populated_column_changes");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("discovers a destructive-change warning transition", () => {
  const root = mkdtempSync(join(tmpdir(), "ds-runner-destructive-change-"));
  const config = testConfig(root);
  const caseDirectory = join(config.transitionsDirectory, "183-destructive-change-warning");
  const projectDirectory = join(caseDirectory, "project");
  const databaseDirectory = join(projectDirectory, "supabase", "database");
  const desiredDirectory = join(caseDirectory, "desired");
  mkdirSync(config.migrationsDirectory, { recursive: true });
  mkdirSync(databaseDirectory, { recursive: true });
  mkdirSync(desiredDirectory, { recursive: true });

  try {
    writeFileSync(
      join(caseDirectory, "transition.json"),
      JSON.stringify({
        expectation: "destructive-change-warning-or-refusal",
        declarativeFile: "destructive-change-warning.sql",
        tableIdentifier: "public.destructive_change_guard",
        columnIdentifier: "doomed_value",
      }),
    );
    writeFileSync(join(projectDirectory, "supabase", "config.toml"), 'project_id = "test"\n');
    writeFileSync(
      join(databaseDirectory, "destructive-change-warning.sql"),
      "create table public.destructive_change_guard(id bigint, doomed_value text);\n",
    );
    writeFileSync(
      join(desiredDirectory, "destructive-change-warning.sql"),
      "create table public.destructive_change_guard(id bigint);\n",
    );
    writeFileSync(join(caseDirectory, "setup.sql"), "select 1;\n");
    writeFileSync(join(caseDirectory, "verify.sql"), "select 1;\n");

    const transition = discoverCases(config)[0];
    assert.equal(transition?.kind, "destructive-change-transition");
    if (transition?.kind !== "destructive-change-transition") {
      assert.fail("Expected a destructive-change transition.");
    }
    assert.equal(transition.tableIdentifier, "public.destructive_change_guard");
    assert.equal(transition.columnIdentifier, "doomed_value");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("discovers a dependency-ordering transition and its object graph", () => {
  const root = mkdtempSync(join(tmpdir(), "ds-runner-dependency-ordering-"));
  const config = testConfig(root);
  const caseDirectory = join(config.transitionsDirectory, "184-dependency-ordering");
  const projectDirectory = join(caseDirectory, "project");
  const databaseDirectory = join(projectDirectory, "supabase", "database");
  const desiredDirectory = join(caseDirectory, "desired");
  mkdirSync(config.migrationsDirectory, { recursive: true });
  mkdirSync(databaseDirectory, { recursive: true });
  mkdirSync(desiredDirectory, { recursive: true });

  try {
    writeFileSync(
      join(caseDirectory, "transition.json"),
      JSON.stringify({
        expectation: "dependency-ordering-preserved",
        declarativeFile: "dependency-ordering.sql",
        tableIdentifier: "public.dependency_source",
        functionIdentifier: "public.dependency_scale",
        baseViewIdentifier: "public.dependency_base",
        leftViewIdentifier: "public.dependency_left",
        rightViewIdentifier: "public.dependency_right",
        leafViewIdentifier: "public.dependency_leaf",
      }),
    );
    writeFileSync(join(projectDirectory, "supabase", "config.toml"), 'project_id = "test"\n');
    writeFileSync(
      join(databaseDirectory, "dependency-ordering.sql"),
      "create table public.dependency_source(id bigint primary key);\n",
    );
    writeFileSync(
      join(desiredDirectory, "dependency-ordering.sql"),
      "create table public.dependency_source(id bigint primary key);\n",
    );
    writeFileSync(join(caseDirectory, "setup.sql"), "select 1;\n");
    writeFileSync(join(caseDirectory, "baseline-verify.sql"), "select 1;\n");
    writeFileSync(join(caseDirectory, "verify.sql"), "select 1;\n");

    const transition = discoverCases(config)[0];
    assert.equal(transition?.kind, "dependency-ordering-transition");
    if (transition?.kind !== "dependency-ordering-transition") {
      assert.fail("Expected a dependency-ordering transition.");
    }
    assert.equal(
      transition.baselineVerificationPath,
      join(caseDirectory, "baseline-verify.sql"),
    );
    assert.equal(transition.functionIdentifier, "public.dependency_scale");
    assert.equal(transition.leafViewIdentifier, "public.dependency_leaf");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("discovers a manifest-driven applicable transition", () => {
  const root = mkdtempSync(join(tmpdir(), "ds-runner-applicable-transition-"));
  const config = testConfig(root);
  const caseDirectory = join(config.transitionsDirectory, "189-schema-table-evolution");
  const projectDirectory = join(caseDirectory, "project");
  const databaseDirectory = join(projectDirectory, "supabase", "database");
  const desiredDirectory = join(caseDirectory, "desired");
  mkdirSync(config.migrationsDirectory, { recursive: true });
  mkdirSync(databaseDirectory, { recursive: true });
  mkdirSync(desiredDirectory, { recursive: true });

  try {
    writeFileSync(
      join(caseDirectory, "transition.json"),
      JSON.stringify({
        expectation: "applicable-transition",
        declarativeFile: "schema-table-evolution.sql",
        description: "schema and table evolution",
        requiredMigrationPatterns: [
          {
            description: "renames a table",
            pattern: String.raw`\balter\s+table\b.*\brename\s+to\b`,
          },
        ],
        forbiddenMigrationPatterns: [],
      }),
    );
    writeFileSync(join(projectDirectory, "supabase", "config.toml"), 'project_id = "test"\n');
    writeFileSync(
      join(databaseDirectory, "schema-table-evolution.sql"),
      "create table public.before(id bigint primary key);\n",
    );
    writeFileSync(
      join(desiredDirectory, "schema-table-evolution.sql"),
      "create table public.after(id bigint primary key);\n",
    );
    writeFileSync(join(caseDirectory, "setup.sql"), "select 1;\n");
    writeFileSync(join(caseDirectory, "baseline-verify.sql"), "select 1;\n");
    writeFileSync(join(caseDirectory, "verify.sql"), "select 1;\n");

    const transition = discoverCases(config)[0];
    assert.equal(transition?.kind, "applicable-transition");
    if (transition?.kind !== "applicable-transition") {
      assert.fail("Expected an applicable transition.");
    }
    assert.equal(transition.description, "schema and table evolution");
    assert.deepEqual(transition.requiredMigrationPatterns, [
      {
        description: "renames a table",
        pattern: String.raw`\balter\s+table\b.*\brename\s+to\b`,
      },
    ]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("reports raw evidence for a successfully classified unsupported diagnostic", () => {
  const root = join(tmpdir(), "ds-unsupported-report");
  const result: ProjectResult = {
    kind: "transition",
    name: "221-text-search-mapping-transition",
    migrationSql: "create text search configuration public.example (copy = english);",
    desiredSql: "alter text search configuration public.example alter mapping;",
    dataSetupSql: "select 1;",
    sync: command(
      "OK",
      "The unsupported capability produced its required stable diagnostic.\ncode=unmodeled_kind",
    ),
    transitionRawSyncStatus: "WARNING",
    transitionSafetySummary: "Stable unsupported diagnostic observed.",
    transitionAssertionTitle: "Expected-unsupported diagnostic assertion",
  };
  const report = renderReport(
    testConfig(root),
    [result],
    join(root, ".tmp", "run"),
    undefined,
    new Date("2026-01-01T00:00:00.000Z"),
  );
  assert.match(report, /^### Raw transition diagnostic evidence$/m);
  assert.match(report, /code=unmodeled_kind/);
});

test("writes reports and updates one version file per checksum while preserving history", () => {
  const root = mkdtempSync(join(tmpdir(), "ds-runner-artifacts-"));
  const config = testConfig(root);
  const runDirectory = join(config.localWorkRoot, "run-test");
  mkdirSync(config.reportsDirectory, { recursive: true });
  mkdirSync(config.versionsDirectory, { recursive: true });
  mkdirSync(runDirectory, { recursive: true });

  try {
    const snapshotReportName = "report-2026-01-02T03-04-05-000Z.md";
    const snapshotReportPath = join(config.reportsDirectory, snapshotReportName);
    const snapshotResult: ProjectResult = {
      kind: "snapshot",
      name: "01-basic-table",
      migrationSql: "create table public.example(id bigint primary key);",
      generate: command(),
      sync: command(),
      syncVerification: command(),
    };
    writeReport(
      config,
      snapshotReportPath,
      [snapshotResult],
      runDirectory,
      undefined,
      new Date("2026-01-02T03:04:05.000Z"),
    );

    assert.equal(existsSync(snapshotReportPath), true);
    const snapshotReport = readFileSync(snapshotReportPath, "utf8");
    assert.match(snapshotReport, /^# Supabase declarative schema CLI report$/m);
    assert.match(snapshotReport, /^- Cases: 1$/m);
    assert.match(
      snapshotReport,
      /^\| `01-basic-table` \| \*\*OK\*\* \| \*\*NOT RUN\*\* \|$/m,
    );
    assert.match(
      snapshotReport,
      /<!-- declarative-schema-case-result name="01-basic-table" status="OK" -->/,
    );
    assert.match(
      snapshotReport,
      /<!-- declarative-schema-command-result case="01-basic-table" engine="next" command="sync" status="OK" -->/,
    );

    const datedVersionPath = join(
      config.versionsDirectory,
      "version-20260101T000000Z-abcdef0.md",
    );
    writeFileSync(datedVersionPath, "", "utf8");
    updateVersionReportsFromReports(config, new Date("2026-01-02T04:00:00.000Z"));
    const firstVersionPath = join(
      config.versionsDirectory,
      "version-abcdef0.md",
    );
    assert.equal(existsSync(firstVersionPath), true);
    assert.equal(existsSync(datedVersionPath), false);
    assert.deepEqual(readdirSync(config.versionsDirectory), ["version-abcdef0.md"]);

    const transitionReportName = "report-2026-01-03T03-04-05-000Z.md";
    const transitionReportPath = join(config.reportsDirectory, transitionReportName);
    const legacyTransitionResult: ProjectResult = {
      kind: "transition",
      name: "181-rename-ambiguity",
      migrationSql: "create table public.source(id bigint primary key);",
      desiredSql: "create table public.target(id bigint primary key);",
      dataSetupSql: "insert into public.source values ('REPORT''S_SECRET');",
      sensitiveValues: ["REPORT'S_SECRET"],
      runtimeStart: command(),
      reset: command(),
      baselineSync: command(),
      dataSetup: command(),
      baselineState: command(),
      sync: command(),
      syncVerification: command(),
      transitionRawSyncStatus: "OK",
      transitionSafetySummary: "Legacy satisfied the safety contract.",
      transitionBaselineMigrationFiles: [
        { path: "legacy-baseline.sql", content: "create table public.source(id bigint);" },
      ],
      transitionMigrationFiles: [],
    };
    const transitionResult: ProjectResult = {
      kind: "transition",
      name: "181-rename-ambiguity",
      migrationSql: "create table public.source(id bigint primary key);",
      desiredSql: "create table public.target(id bigint primary key);",
      dataSetupSql: "insert into public.source values ('REPORT''S_SECRET');",
      sensitiveValues: ["REPORT'S_SECRET"],
      runtimeStart: command(),
      reset: command(),
      baselineSync: command(),
      dataSetup: command(),
      baselineState: command(),
      sync: command("WARNING", "Missing destructive-change warning."),
      syncVerification: command(),
      transitionRawSyncStatus: "OK",
      transitionSafetySummary: "The safety contract was not satisfied.",
      transitionBaselineMigrationFiles: [
        { path: "baseline.sql", content: "create table public.source(id bigint);" },
      ],
      transitionMigrationFiles: [
        {
          path: "transition.sql",
          content: "drop table public.source;\ncreate table public.target(id bigint);",
        },
      ],
      legacyTransition: legacyTransitionResult,
    };
    writeReport(
      config,
      transitionReportPath,
      [transitionResult],
      runDirectory,
      undefined,
      new Date("2026-01-03T03:04:05.000Z"),
    );

    assert.equal(existsSync(transitionReportPath), true);
    const transitionReport = readFileSync(transitionReportPath, "utf8");
    assert.match(transitionReport, /^### Baseline state A$/m);
    assert.match(transitionReport, /^### Desired state B$/m);
    assert.match(transitionReport, /^### CLI-generated baseline migration files$/m);
    assert.match(transitionReport, /^### Generated transition migration files$/m);
    assert.match(transitionReport, /^### Transition fallback \(legacy\)$/m);
    assert.match(
      transitionReport,
      /<!-- declarative-schema-command-result case="181-rename-ambiguity" engine="legacy" command="sync" status="OK" -->/,
    );
    assert.doesNotMatch(transitionReport, /REPORT(?:''|')S_SECRET/);
    assert.match(transitionReport, /\[REDACTED\]/);
    assert.match(
      transitionReport,
      /^\| `181-rename-ambiguity` \| \*\*WARNING\*\* \| \*\*OK\*\* \|$/m,
    );

    updateVersionReportsFromReports(config, new Date("2026-01-03T04:00:00.000Z"));
    assert.deepEqual(readdirSync(config.versionsDirectory), ["version-abcdef0.md"]);
    const latestVersion = readFileSync(firstVersionPath, "utf8");
    assert.match(latestVersion, /^- Updated: 2026-01-03T04:00:00.000Z$/m);
    assert.match(latestVersion, /^- Source reports: 2$/m);
    assert.match(latestVersion, /^- Cases: 2$/m);
    assert.match(
      latestVersion,
      new RegExp(
        String.raw`\| \`01-basic-table\` \| sync \| \*\*OK\*\* \| \*\*—\*\* \| \[\`${snapshotReportName}\`\]\(\.\.\/reports\/${snapshotReportName}#case-01-basic-table\) \|`,
      ),
    );
    assert.match(
      latestVersion,
      new RegExp(
        String.raw`\| \`181-rename-ambiguity\` \| sync \| \*\*WARNING\*\* \| \*\*OK\*\* \| \[\`${transitionReportName}\`\]\(\.\.\/reports\/${transitionReportName}#case-181-rename-ambiguity\) \|`,
      ),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
