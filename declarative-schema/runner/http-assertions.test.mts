import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import { runHttpBehaviorStep } from "./http-assertions.mts";
import type { RunnerConfig } from "./types.mts";

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

test("executes HTTP behavior with credential templates and assertions", async () => {
  const server = createServer((request, response) => {
    assert.equal(request.headers["apikey"], "anon-test-key");
    response.setHeader("x-case", "coverage");
    response.end('{"ok":true}');
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  try {
    const result = await runHttpBehaviorStep(
      config,
      {
        apiUrl: `http://127.0.0.1:${address.port}`,
        anonKey: "anon-test-key",
        serviceRoleKey: "service-test-key",
      },
      {
        description: "HTTP behavior",
        method: "GET",
        path: "/items",
        credential: "anon",
        expectedStatus: 200,
        expectedBodyPattern: String.raw`"ok"\s*:\s*true`,
        expectedHeaderPatterns: { "x-case": "^coverage$" },
      },
    );
    assert.equal(result.status, "OK");
    assert.doesNotMatch(result.command, /anon-test-key/);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => error ? reject(error) : resolve())
    );
  }
});

test("returns an assertion error for unexpected responses", async () => {
  const server = createServer((_request, response) => {
    response.statusCode = 403;
    response.end("forbidden");
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  try {
    const result = await runHttpBehaviorStep(
      config,
      {
        apiUrl: `http://127.0.0.1:${address.port}`,
        anonKey: "anon",
        serviceRoleKey: "service",
      },
      {
        description: "Unexpected response",
        method: "GET",
        path: "/items",
        expectedStatus: 200,
      },
    );
    assert.equal(result.status, "ERROR");
    assert.match(result.output, /expected status 200/);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => error ? reject(error) : resolve())
    );
  }
});
