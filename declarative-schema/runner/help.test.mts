import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

test("--help prints usage and exits successfully", () => {
  const runnerPath = resolve(dirname(fileURLToPath(import.meta.url)), "..", "run.mts");
  const result = spawnSync(
    process.execPath,
    ["--experimental-strip-types", runnerPath, "--help"],
    { encoding: "utf8" },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, "");
  assert.match(result.stdout, /^Usage: npm run declarative-schema -- \[options\]/);
  assert.match(result.stdout, /--case=<selection>/);
  assert.match(result.stdout, /--failed/);
  assert.match(result.stdout, /--not-ok/);
  assert.match(result.stdout, /--verbose/);
  assert.match(result.stdout, /--help/);
});
