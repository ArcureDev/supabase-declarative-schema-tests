import assert from "node:assert/strict";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { describeCommandFailure } from "./commands.mts";
import { discoverCases } from "./files.mts";
import { writeReport } from "./reporting.mts";
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

test("writes compatible report and version files while preserving targeted history", () => {
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

    updateVersionReportsFromReports(config, new Date("2026-01-02T04:00:00.000Z"));
    const firstVersionPath = join(
      config.versionsDirectory,
      "version-20260102T030405Z-abcdef0.md",
    );
    assert.equal(existsSync(firstVersionPath), true);

    const transitionReportName = "report-2026-01-03T03-04-05-000Z.md";
    const transitionReportPath = join(config.reportsDirectory, transitionReportName);
    const transitionResult: ProjectResult = {
      kind: "transition",
      name: "181-rename-ambiguity",
      migrationSql: "create table public.source(id bigint primary key);",
      desiredSql: "create table public.target(id bigint primary key);",
      dataSetupSql: "insert into public.source values (1);",
      runtimeStart: command(),
      reset: command(),
      baselineSync: command(),
      dataSetup: command(),
      baselineState: command(),
      sync: command("ERROR", "Missing destructive-change warning."),
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
    assert.match(
      transitionReport,
      /^\| `181-rename-ambiguity` \| \*\*FAILED\*\* \| \*\*NOT RUN\*\* \|$/m,
    );

    updateVersionReportsFromReports(config, new Date("2026-01-03T04:00:00.000Z"));
    const latestVersionPath = join(
      config.versionsDirectory,
      "version-20260103T030405Z-abcdef0.md",
    );
    assert.equal(existsSync(latestVersionPath), true);
    const latestVersion = readFileSync(latestVersionPath, "utf8");
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
        String.raw`\| \`181-rename-ambiguity\` \| sync \| \*\*ERROR\*\* \| \*\*—\*\* \| \[\`${transitionReportName}\`\]\(\.\.\/reports\/${transitionReportName}#case-181-rename-ambiguity\) \|`,
      ),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
