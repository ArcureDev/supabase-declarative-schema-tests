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
  const numbers = cases.map((fixture) => caseNumberFromName(fixture.name));
  assert.equal(numbers[0], 1);
  assert.deepEqual(
    numbers,
    Array.from({ length: cases.length }, (_, index) => index + 1),
  );

  const snapshots = cases.filter((fixture) => fixture.kind === "snapshot");
  const coverage = cases.filter((fixture) => fixture.kind === "coverage");
  const transitions = cases.filter(
    (fixture) => fixture.kind !== "snapshot" && fixture.kind !== "coverage",
  );
  assert.equal(snapshots.length, 180);
  assert.equal(coverage.length, 30);
  assert.ok(transitions.length >= 87, "transition fixtures must remain in the catalog");
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
    "245-managed-schema-negative-probe",
    "246-managed-boundary-retention",
    "248-extension-absence-version-diagnostic",
    "249-jwt-custom-claims-mfa-rls",
    "250-anonymous-rls",
    "252-auth-users-trigger-hardening",
    "253-supabase-role-boundaries",
    "255-storage-policy-matrix",
    "256-storage-reference-helpers",
    "258-realtime-publication-removal",
    "259-filtered-column-publication",
    "260-broadcast-presence-policies",
    "261-database-broadcast-helper-evolution",
    "263-pg-net-trigger-lifecycle",
    "264-vault-backed-webhook-redaction",
    "276-pg-graphql-comments-inflection",
    "278-wrappers-vault-credential-redaction",
    "297-managed-database-webhook-trigger",
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
    assert.ok(fixture.catalogueAtoms.length >= 0, fixture.name);
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
