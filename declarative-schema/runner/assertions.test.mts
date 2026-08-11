import assert from "node:assert/strict";
import test from "node:test";
import {
  assertApplicableMigrationSafe,
  assertDeterministicMigrationOutput,
  assertDependencyOrderingMigrationSafe,
  assertDestructiveColumnDropHandledSafely,
  assertExpectedNotNullFailure,
  assertExpectedUnsupported,
  assertGrantsRlsMigrationSafe,
  assertNoOpConverged,
  assertPopulatedColumnMigrationSafe,
  assertRecoveryMigrationSafe,
  assertRenameAmbiguityHandledSafely,
  requireDependencyOrderingStatePreserved,
  requirePopulatedColumnStatePreserved,
  requireRecoveryStateComplete,
  requireVerifiedStatePreserved,
} from "./assertions.mts";
import type { CommandResult } from "./types.mts";

function command(output: string): CommandResult {
  return {
    command: "npx supabase example",
    durationMilliseconds: 100,
    exitCode: 0,
    output,
    status: "OK",
  };
}

test("manifest-driven migration assertions require and forbid declared shapes", () => {
  const required = [
    { description: "renames the table", pattern: String.raw`\balter\s+table\b.*\brename\s+to\b` },
  ];
  const forbidden = [
    { description: "recreates the anchor", pattern: String.raw`\bcreate\s+table\s+public\.anchor\b` },
  ];
  const safe = assertApplicableMigrationSafe(
    command("Created migration"),
    [{ path: "migration.sql", content: "alter table public.before rename to after;" }],
    required,
    forbidden,
  );
  assert.equal(safe.result.status, "OK");

  const missing = assertApplicableMigrationSafe(
    command("Created migration"),
    [{ path: "migration.sql", content: "comment on table public.before is 'same';" }],
    required,
    forbidden,
  );
  assert.equal(missing.result.status, "ERROR");

  const commentedOnly = assertApplicableMigrationSafe(
    command("Created migration"),
    [{ path: "migration.sql", content: "-- alter table public.before rename to after;" }],
    required,
    forbidden,
  );
  assert.equal(commentedOnly.result.status, "ERROR");

  const destructive = assertApplicableMigrationSafe(
    command("Created migration"),
    [{
      path: "migration.sql",
      content: "alter table public.before rename to after; create table public.anchor(id bigint);",
    }],
    required,
    forbidden,
  );
  assert.equal(destructive.result.status, "ERROR");

  const leaked = assertApplicableMigrationSafe(
    command("debug password=VERY_SECRET_VALUE"),
    [{ path: "migration.sql", content: "alter table public.before rename to after;" }],
    required,
    forbidden,
    ["VERY_SECRET_VALUE"],
  );
  assert.equal(leaked.result.status, "ERROR");
});

test("expected-unsupported assertions require a stable safe diagnostic", () => {
  const warning = command(
    "Warning: code=unmodeled_kind object public.transition_search",
  );
  warning.status = "WARNING";
  const expected = assertExpectedUnsupported(
    warning,
    [],
    [
      { description: "stable code", pattern: String.raw`\bcode=unmodeled_kind\b` },
      { description: "object name", pattern: String.raw`\bpublic\.transition_search\b` },
    ],
    [{ description: "no destructive SQL", pattern: String.raw`\bdrop\b` }],
  );
  assert.equal(expected.result.status, "OK");

  const newlySupported = assertExpectedUnsupported(
    command("No schema changes found"),
    [],
    [{ description: "stable code", pattern: String.raw`\bcode=unmodeled_kind\b` }],
    [],
  );
  assert.equal(newlySupported.result.status, "ERROR");
  assert.match(newlySupported.summary, /promote this fixture/i);

  const spoofed = command("Error: connection refused");
  spoofed.status = "ERROR";
  spoofed.exitCode = 1;
  assert.equal(
    assertExpectedUnsupported(
      spoofed,
      [{ path: "migration.sql", content: "-- code=unmodeled_kind" }],
      [{ description: "stable code", pattern: String.raw`\bcode=unmodeled_kind\b` }],
      [],
    ).result.status,
    "ERROR",
  );
});

test("rename ambiguity requires a diagnostic and rejects inferred rename", () => {
  const dropAndCreateMigration = [
    {
      path: "migration.sql",
      content:
        'drop table "public"."source";\ncreate table "public"."target" (id bigint);',
    },
  ];

  const silent = assertRenameAmbiguityHandledSafely(
    command("Created migration"),
    dropAndCreateMigration,
    "public.source",
  );
  assert.equal(silent.result.status, "WARNING");

  const warned = assertRenameAmbiguityHandledSafely(
    command("Warning: destructive change for public.source"),
    dropAndCreateMigration,
    "public.source",
  );
  assert.equal(warned.result.status, "OK");

  const inferred = assertRenameAmbiguityHandledSafely(
    command("Warning: ambiguous rename for public.source"),
    [{ path: "migration.sql", content: "alter table public.source rename to target;" }],
    "public.source",
  );
  assert.equal(inferred.result.status, "WARNING");

  const failedCommand = command("Unexpected CLI failure");
  failedCommand.exitCode = 1;
  failedCommand.status = "ERROR";
  const failed = assertRenameAmbiguityHandledSafely(
    failedCommand,
    dropAndCreateMigration,
    "public.source",
  );
  assert.equal(failed.result.status, "ERROR");
});

test("destructive column drop requires an explicit targeted diagnostic", () => {
  const migration = [
    {
      path: "migration.sql",
      content:
        'alter table "public"."destructive_change_guard" drop column "doomed_value";',
    },
  ];
  const warned = assertDestructiveColumnDropHandledSafely(
    command(
      "Warning: destructive change would drop public.destructive_change_guard.doomed_value",
    ),
    migration,
    "public.destructive_change_guard",
    "doomed_value",
  );
  assert.equal(warned.result.status, "OK");

  const cliWarning = assertDestructiveColumnDropHandledSafely(
    command(
      "Found drop statements in schema diff. Please double check if these are expected:",
    ),
    migration,
    "public.destructive_change_guard",
    "doomed_value",
  );
  assert.equal(cliWarning.result.status, "OK");

  const silent = assertDestructiveColumnDropHandledSafely(
    command("Created migration"),
    migration,
    "public.destructive_change_guard",
    "doomed_value",
  );
  assert.equal(silent.result.status, "WARNING");

  const pathOnly = assertDestructiveColumnDropHandledSafely(
    command(
      "Created new migration at C:\\tmp\\183-destructive-change-warning\\migration.sql",
    ),
    migration,
    "public.destructive_change_guard",
    "doomed_value",
  );
  assert.equal(pathOnly.result.status, "WARNING");

  const refusedCommand = command(
    "Error: refused destructive drop of public.destructive_change_guard.doomed_value",
  );
  refusedCommand.exitCode = 1;
  refusedCommand.status = "ERROR";
  const refused = assertDestructiveColumnDropHandledSafely(
    refusedCommand,
    [],
    "public.destructive_change_guard",
    "doomed_value",
  );
  assert.equal(refused.result.status, "OK");
});

test("populated-column migration requires in-place non-destructive operations", () => {
  const migration = [
    {
      path: "migration.sql",
      content: [
        'alter table "public"."populated_column_changes" add column "added_value" text not null default \'backfilled\'::text;',
        'alter table "public"."populated_column_changes" alter column "widening_value" type bigint;',
        'alter table "public"."populated_column_changes" alter column "defaulted_value" set default \'after\'::text;',
        'alter table "public"."populated_column_changes" alter column "nullable_value" set not null;',
      ].join("\n"),
    },
  ];
  const safe = assertPopulatedColumnMigrationSafe(
    command("Created migration"),
    migration,
    "public.populated_column_changes",
  );
  assert.equal(safe.result.status, "OK");

  const destructive = assertPopulatedColumnMigrationSafe(
    command("Created migration"),
    [
      {
        path: "migration.sql",
        content: `${migration[0]?.content}\ndrop table public.populated_column_changes;`,
      },
    ],
    "public.populated_column_changes",
  );
  assert.equal(destructive.result.status, "ERROR");

  const incomplete = assertPopulatedColumnMigrationSafe(
    command("Created migration"),
    [{ path: "migration.sql", content: migration[0]?.content.split("\n")[0] ?? "" }],
    "public.populated_column_changes",
  );
  assert.equal(incomplete.result.status, "ERROR");
});

test("populated-column state requires stable identity, data, and defaults", () => {
  const baseline = command(
    '{"table_oid": "1234", "data_valid": true, "row_count": 2}',
  );
  const desired = command(
    '{"table_oid": 1234, "schema_valid": true, "preserved_rows_valid": true, "new_defaults_valid": true, "row_count": 3}',
  );
  assert.equal(requirePopulatedColumnStatePreserved(baseline, desired).status, "OK");

  const replaced = command(
    '{"table_oid": 5678, "schema_valid": true, "preserved_rows_valid": true, "new_defaults_valid": true, "row_count": 3}',
  );
  assert.equal(requirePopulatedColumnStatePreserved(baseline, replaced).status, "ERROR");
});

test("dependency-ordering migration requires a topologically ordered chain and diamond", () => {
  const identifiers = {
    tableIdentifier: "public.dependency_source",
    functionIdentifier: "public.dependency_scale",
    baseViewIdentifier: "public.dependency_base",
    leftViewIdentifier: "public.dependency_left",
    rightViewIdentifier: "public.dependency_right",
    leafViewIdentifier: "public.dependency_leaf",
  };
  const orderedSql = [
    "create function public.dependency_scale(input_value bigint) returns bigint language sql as $$ select input_value * 2 $$;",
    "create view public.dependency_base as select public.dependency_scale(raw_value) from public.dependency_source;",
    "create view public.dependency_left as select * from public.dependency_base;",
    "create view public.dependency_right as select * from public.dependency_base;",
    "create view public.dependency_leaf as select * from public.dependency_left join public.dependency_right using (id);",
  ].join("\n");
  const ordered = assertDependencyOrderingMigrationSafe(
    command("Created migration"),
    [{ path: "migration.sql", content: orderedSql }],
    identifiers,
  );
  assert.equal(ordered.result.status, "OK");

  const outOfOrder = assertDependencyOrderingMigrationSafe(
    command("Created migration"),
    [
      {
        path: "migration.sql",
        content: [
          orderedSql.split("\n")[0],
          orderedSql.split("\n")[4],
          ...orderedSql.split("\n").slice(1, 4),
        ].join("\n"),
      },
    ],
    identifiers,
  );
  assert.equal(outOfOrder.result.status, "ERROR");

  const destructive = assertDependencyOrderingMigrationSafe(
    command("Created migration"),
    [{ path: "migration.sql", content: `${orderedSql}\ndrop table public.dependency_source;` }],
    identifiers,
  );
  assert.equal(destructive.result.status, "ERROR");
});

test("dependency-ordering state requires stable source identity and valid dependencies", () => {
  const baseline = command(
    '{"table_oid": "1234", "data_valid": true, "row_count": 2}',
  );
  const desired = command(
    '{"table_oid": 1234, "schema_valid": true, "dependencies_valid": true, "rows_valid": true, "row_count": 3}',
  );
  assert.equal(requireDependencyOrderingStatePreserved(baseline, desired).status, "OK");

  const invalidDependencies = command(
    '{"table_oid": 1234, "schema_valid": true, "dependencies_valid": false, "rows_valid": true, "row_count": 3}',
  );
  assert.equal(
    requireDependencyOrderingStatePreserved(baseline, invalidDependencies).status,
    "ERROR",
  );
});

test("remaining P0 migration assertions enforce their safety contracts", () => {
  const noOp = assertNoOpConverged(command("No schema changes found"), []);
  assert.equal(noOp.result.status, "OK");
  assert.equal(
    assertNoOpConverged(
      command("Created migration"),
      [{ path: "migration.sql", content: "select 1;" }],
    ).result.status,
    "ERROR",
  );

  const grantsMigration = [
    {
      path: "migration.sql",
      content:
        "alter table public.grants_rls_guard add column note text not null default '';",
    },
  ];
  assert.equal(
    assertGrantsRlsMigrationSafe(command("Created migration"), grantsMigration).result.status,
    "OK",
  );
  assert.equal(
    assertGrantsRlsMigrationSafe(command("Created migration"), [
      {
        path: "migration.sql",
        content: `${grantsMigration[0]?.content}\nrevoke select on public.grants_rls_guard from authenticated;`,
      },
    ]).result.status,
    "ERROR",
  );

  const recoveryMigration = [
    {
      path: "migration.sql",
      content:
        "alter table public.recovery_after_failure_guard alter column required_later set not null;",
    },
  ];
  assert.equal(
    assertRecoveryMigrationSafe(command("Created migration"), recoveryMigration).result.status,
    "OK",
  );
});

test("determinism and recovery assertions distinguish stable and recoverable outcomes", () => {
  const files = [{ path: "migration.sql", content: "create table public.example(id bigint);" }];
  assert.equal(
    assertDeterministicMigrationOutput(
      command("Created first"),
      files,
      command("Created second"),
      [{ path: "different-name.sql", content: files[0]?.content ?? "" }],
    ).result.status,
    "OK",
  );
  assert.equal(
    assertDeterministicMigrationOutput(
      command("Created first"),
      files,
      command("Created second"),
      [{ path: "migration.sql", content: "select 1;" }],
    ).result.status,
    "ERROR",
  );

  const failedApply = command(
    'column "required_later" of relation "recovery_after_failure_guard" contains null values',
  );
  failedApply.status = "ERROR";
  failedApply.exitCode = 1;
  assert.equal(assertExpectedNotNullFailure(failedApply).result.status, "OK");
});

test("generic verified and recovery states require stable table identity", () => {
  const baseline = command('{"identity": "1234", "valid": true}');
  const desired = command('{"identity": 1234, "valid": true}');
  assert.equal(
    requireVerifiedStatePreserved(baseline, desired, "Security transition").status,
    "OK",
  );

  const recoveryBaseline = command('{"table_oid": "4321", "not_null": false}');
  const recoveryDesired = command(
    '{"table_oid": 4321, "not_null": true, "rows_valid": true}',
  );
  assert.equal(
    requireRecoveryStateComplete(recoveryBaseline, recoveryDesired).status,
    "OK",
  );
});
