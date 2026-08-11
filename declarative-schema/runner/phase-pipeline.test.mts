import assert from "node:assert/strict";
import test from "node:test";
import { runPhasePipeline } from "./phase-pipeline.mts";
import type {
  CommandResult,
  RunnerConfig,
} from "./types.mts";

const config: RunnerConfig = {
  scriptDirectory: "test",
  repositoryDirectory: "test",
  supabaseCliEntry: "supabase.js",
  supabaseCliVersion: "test",
  supabaseChecksum: "abcdef0",
  migrationsDirectory: "migrations",
  transitionsDirectory: "transitions",
  coverageDirectory: "coverage",
  runtimeTemplateDirectory: "runtime",
  localDatabaseContainer: "supabase_db_test",
  localWorkRoot: ".tmp",
  reportsDirectory: "reports",
  versionsDirectory: "versions",
  commandTimeoutMilliseconds: 1_000,
  verbose: false,
};

function result(status: CommandResult["status"]): CommandResult {
  return {
    command: "test",
    durationMilliseconds: 1,
    exitCode: status === "ERROR" ? 1 : status === "SKIPPED" ? null : 0,
    output: status,
    status,
  };
}

test("pipeline skips dependent phases and still runs independent evidence", async () => {
  const ran: string[] = [];
  const phases = await runPhasePipeline(config, [
    {
      id: "baseline",
      title: "Baseline",
      plane: "ddl",
      run: () => {
        ran.push("baseline");
        return result("ERROR");
      },
    },
    {
      id: "behavior",
      title: "Behavior",
      plane: "service",
      dependsOn: ["baseline"],
      run: () => {
        ran.push("behavior");
        return result("OK");
      },
    },
    {
      id: "evidence",
      title: "Evidence",
      plane: "service",
      run: () => {
        ran.push("evidence");
        return result("OK");
      },
    },
  ]);

  assert.deepEqual(ran, ["baseline", "evidence"]);
  assert.deepEqual(
    phases.map((phase) => phase.commandResult.status),
    ["ERROR", "SKIPPED", "OK"],
  );
});

test("pipeline rejects duplicate and forward dependency IDs", async () => {
  await assert.rejects(
    () =>
      runPhasePipeline(config, [
        {
          id: "later",
          title: "Later",
          plane: "ddl",
          dependsOn: ["missing"],
          run: () => result("OK"),
        },
      ]),
    /unknown or later phase/,
  );
  await assert.rejects(
    () =>
      runPhasePipeline(config, [
        { id: "same", title: "One", plane: "ddl", run: () => result("OK") },
        { id: "same", title: "Two", plane: "ddl", run: () => result("OK") },
      ]),
    /duplicate pipeline phase ID/,
  );
});
