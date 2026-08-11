import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { loadRunnerConfig } from "./config.mts";
import { discoverCases } from "./files.mts";
import { caseNumberFromName } from "./selection.mts";

const scriptDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("checked-in fixture catalog is contiguous and internally valid", () => {
  const config = loadRunnerConfig(scriptDirectory, []);
  const cases = discoverCases(config);
  assert.equal(cases.length, 244);
  assert.deepEqual(
    cases.map((fixture) => caseNumberFromName(fixture.name)),
    Array.from({ length: 244 }, (_, index) => index + 1),
  );

  const transitions = cases.filter((fixture) => fixture.kind !== "snapshot");
  assert.equal(transitions.length, 64);
  const supabaseTransitionNames = [
    "220-realtime-publication-membership",
    "225-managed-schema-boundary",
    "226-auth-uid-policy-hardening",
    "227-storage-object-policy-hardening",
    "228-realtime-message-policy-hardening",
    "229-pg-net-webhook-replacement",
    "230-vault-secret-data-boundary",
    "231-cron-job-data-boundary",
    "232-queue-message-data-boundary",
    "235-pg-graphql-acl-exposure",
    "236-wrappers-openapi-server-options",
    "237-tenant-modular-graphql-release",
    "239-realtime-social-managed-boundaries",
    "241-geospatial-analytics-integration",
  ];
  assert.deepEqual(
    transitions
      .filter(
        (fixture) =>
          dirname(fixture.directory) === join(config.transitionsDirectory, "supabase"),
      )
      .map((fixture) => fixture.name),
    supabaseTransitionNames,
  );
  for (const fixture of transitions) {
    if (fixture.kind === "expected-unsupported-transition") {
      assert.ok(fixture.requiredDiagnosticPatterns.length > 0, fixture.name);
      assert.ok(fixture.forbiddenDiagnosticPatterns.length > 0, fixture.name);
    }
    if (fixture.kind !== "applicable-transition") continue;
    assert.ok(fixture.requiredMigrationPatterns.length > 0, fixture.name);
    assert.ok(fixture.forbiddenMigrationPatterns.length > 0, fixture.name);
    const baselineVerification = readFileSync(
      fixture.baselineVerificationPath,
      "utf8",
    );
    const desiredVerification = readFileSync(fixture.verificationPath, "utf8");
    for (const verification of [baselineVerification, desiredVerification]) {
      assert.match(verification, /jsonb?_build_object\s*\(/i, fixture.name);
      assert.match(verification, /'identity'/i, fixture.name);
      assert.match(verification, /'valid'/i, fixture.name);
    }

    const setup = readFileSync(fixture.dataSetupPath, "utf8");
    const sentinels = setup.match(/\bPGDELTA_[A-Z0-9_]+\b/g) ?? [];
    for (const sentinel of sentinels) {
      assert.ok(
        fixture.sensitiveValues.includes(sentinel),
        `${fixture.name} must declare ${sentinel} as sensitive`,
      );
    }
  }
});
