import assert from "node:assert/strict";
import test from "node:test";
import { assertRenameAmbiguityHandledSafely } from "./assertions.mts";
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
  assert.equal(silent.result.status, "ERROR");

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
  assert.equal(inferred.result.status, "ERROR");
});
