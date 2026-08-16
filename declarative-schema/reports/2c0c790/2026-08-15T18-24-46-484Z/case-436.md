# Case: 436-partition-list

- Scenario pack: `Partitions and inheritance catalogue scenarios` / `partition-list`
- Catalogue atoms: `PG-CAT-PRT-01::partition.list`

## Baseline state A

```sql
-- Covers PG-CAT-PRT-01::partition.list. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_partition_list (
  id bigint primary key, label text
);
```

## Desired state B

```sql
-- Covers PG-CAT-PRT-01::partition.list. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_partition_list (
  id bigint primary key, label text, extra text
);
```

## Representative data setup

```sql
insert into public.transition_anchor values (1, 'preserved');
```

## CLI-generated baseline migration files

### `20260815214631_436_partition_list_baseline.sql`

```sql
create table "public"."catalogue_partition_list" (
  "id"    bigint not null,
  "label" text,
  constraint "catalogue_partition_list_pkey" primary key (id)
);

create table "public"."transition_anchor" (
  "id"      bigint not null,
  "payload" text   not null,
  constraint "transition_anchor_pkey" primary key (id)
);

grant maintain, references, trigger, truncate on table "public"."catalogue_partition_list" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."catalogue_partition_list" to "postgres";

grant maintain, references, trigger, truncate on table "public"."catalogue_partition_list" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **ERROR**
- Assertion: **ERROR**
- The generated migration did not satisfy its declared SQL-shape contract. Raw sync status was ERROR. No transition migration was generated. Missing operation(s): emits native DDL rather than recreating the anchor.

## Generated transition migration files

_(no files generated)_

## Raw transition diagnostic evidence

```text
The generated migration did not satisfy its declared SQL-shape contract. Raw sync status was ERROR. No transition migration was generated. Missing operation(s): emits native DDL rather than recreating the anchor.
NotFound: FileSystem.readFile (C:\Users\Arcure\.supabase\profile)
Using pg-delta next implementation.
Applying migration 20260815214631_436_partition_list_baseline.sql...
No migration SQL was generated.
```

## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `31.5s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 436_partition_list_baseline --debug`
- Result: **OK**
- Duration: `14.2s`

## Insert representative data

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Baseline state capture

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`


## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **ERROR**
- Duration: `3645.5s`

```text
The generated migration did not satisfy its declared SQL-shape contract. Raw sync status was ERROR. No transition migration was generated. Missing operation(s): emits native DDL rather than recreating the anchor.
NotFound: FileSystem.readFile (C:\Users\Arcure\.supabase\profile)
Using pg-delta next implementation.
Applying migration 20260815214631_436_partition_list_baseline.sql...
No migration SQL was generated.
```
<!-- declarative-schema-command-result case="436-partition-list" engine="next" command="sync" status="ERROR" -->

## Apply generated transition migration

- Command: `npx supabase migration up --local --debug`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
The generated migration failed its safety assertion, so it was not applied.
```

## Verify desired state B

- Command: `docker exec ... psql --file -`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
The transition migration was not applied, so desired state B was not verified.
```

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Desired state B verification failed, so convergence was not checked.
```
<!-- declarative-schema-command-result case="436-partition-list" engine="next" command="sync-verification" status="ERROR" -->

## Transition fallback (legacy)

- Overall result: **FAILED**
- Raw sync result: **SKIPPED**
- Assertion: **SKIPPED**
- The safety assertion could not run because the declarative baseline failed.

### Legacy-generated baseline migration files

_(no files generated)_

### Legacy-generated transition migration files

_(no files generated)_

### Start local runtime (legacy)

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `5.0s`

### Clear local runtime before baseline (legacy)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `34.9s`

### Establish baseline (legacy)

- Command: `npx supabase db schema declarative sync --apply --name 436_partition_list_baseline --debug`
- Result: **ERROR**
- Duration: `18.4s`
- Exit code: `1`

```text
NotFound: FileSystem.readFile (C:\Users\Arcure\.supabase\profile)
Using pg-delta legacy implementation.
Creating shadow database...
Creating shadow database...
Applying declarative schemas via pg-delta...
Applied 4 statements in 1 round(s).
Generated migration SQL:
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net;

CREATE TABLE public.catalogue_partition_list (
  id    bigint NOT NULL,
  label text
);

ALTER TABLE public.catalogue_partition_list
  ADD CONSTRAINT catalogue_partition_list_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_partition_list TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_partition_list TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_partition_list TO service_role;

CREATE TABLE public.transition_anchor (
  id      bigint NOT NULL,
  payload text   NOT NULL
);

ALTER TABLE public.transition_anchor
  ADD CONSTRAINT transition_anchor_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO service_role;
Created new migration at E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-DHzNgi\436-partition-list-legacy\supabase\migrations\20260815224815_436_partition_list_baseline.sql
Found drop statements in schema diff. Please double check if these are expected:
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net
Migration failed to apply: ERROR: extension "pg_net" does not exist (SQLSTATE 42704)
At statement: 0
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net

Debug information saved to E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-DHzNgi\436-partition-list-legacy\supabase\.temp\pgdelta\debug\20260815-224815-apply-error

To report this issue, you can:
  1. Open an issue at https://github.com/supabase/pg-toolbelt/issues
     Attach the files from the debug folder above.
  2. Open a support ticket at https://supabase.com/dashboard/support
     (only visible to Supabase employees)

WARNING: The debug folder may contain sensitive information about your
database schema, including table structures, function definitions, and role
configurations. Review the contents carefully before sharing publicly.
If unsure, prefer opening a support ticket (option 2) instead.
ERROR: extension "pg_net" does not exist (SQLSTATE 42704)
At statement: 0
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net
```

### Sync (legacy)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
The declarative baseline failed, so the apply partition.list with a native in-place operation transition was skipped.
```
<!-- declarative-schema-command-result case="436-partition-list" engine="legacy" command="sync" status="ERROR" -->
