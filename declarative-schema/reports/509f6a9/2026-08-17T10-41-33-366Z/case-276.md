# Case: 276-pg-graphql-comments-inflection

## Baseline state A

```sql
-- Invariant: comments are application metadata; pg_graphql remains extension-owned.
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists pg_graphql;
create table public.graphql_notes_276 (
  id bigint generated always as identity primary key,
  label text not null
);
comment on table public.graphql_notes_276 is 'case 276 baseline table';
comment on column public.graphql_notes_276.label is 'case 276 baseline label';
grant select on table public.graphql_notes_276 to anon, authenticated;
```

## Desired state B

```sql
-- Invariant: only application comments define GraphQL inflection.
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists pg_graphql;
create table public.graphql_notes_276 (
  id bigint generated always as identity primary key,
  label text not null
);
comment on table public.graphql_notes_276 is
  '@graphql({"name": "Memo276"})';
comment on column public.graphql_notes_276.label is
  '@graphql({"name": "displayLabel"})';
grant select on table public.graphql_notes_276 to anon, authenticated;
```

## Representative data setup

```sql
-- Invariant: inflection is verified against populated GraphQL-visible data.
insert into public.transition_anchor (case_no, payload)
values (276, 'case-276');

insert into public.graphql_notes_276 (label)
values ('GraphQL row 276');
```

## CLI-generated baseline migration files

### `20260818000747_276_pg_graphql_comments_inflection_baseline.sql`

```sql
create table "public"."graphql_notes_276" (
  "id"    bigint generated always as identity not null,
  "label" text   not null,
  constraint "graphql_notes_276_pkey" primary key (id)
);

create table "public"."transition_anchor" (
  "case_no" integer not null,
  "payload" text    not null,
  constraint "transition_anchor_pkey" primary key (case_no)
);

comment on column "public"."graphql_notes_276"."label" is 'case 276 baseline label';

comment on table "public"."graphql_notes_276" is 'case 276 baseline table';

grant maintain, references, select, trigger, truncate on table "public"."graphql_notes_276" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."graphql_notes_276" to "postgres";

grant maintain, references, trigger, truncate on table "public"."graphql_notes_276" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260818000837_declarative_sync.sql`

```sql
comment on column "public"."graphql_notes_276"."label" is '@graphql({"name": "displayLabel"})';

comment on table "public"."graphql_notes_276" is '@graphql({"name": "Memo276"})';
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `31.2s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 276_pg_graphql_comments_inflection_baseline --debug`
- Result: **OK**
- Duration: `59.4s`

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
- Result: **OK**
- Duration: `49.3s`
<!-- declarative-schema-command-result case="276-pg-graphql-comments-inflection" engine="next" command="sync" status="OK" -->

## Apply generated transition migration

- Command: `npx supabase migration up --local --debug`
- Result: **OK**
- Duration: `0.5s`

## Verify desired state B

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **ERROR**
- Duration: `0.1s`
- Exit code: `3`

```text
change pg_graphql comment directives and verify table and column inflection did not preserve identity or satisfy its catalog/data checks.
Baseline verification:
{"valid": true, "identity": "18057"}
Desired-state verification:
psql:<stdin>:36: ERROR:  function graphql.resolve(query => unknown) does not exist
LINE 2:   select graphql.resolve(
                 ^
HINT:  No function matches the given name and argument types. You might need to add explicit type casts.
```

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Desired state B verification failed, so convergence was not checked.
```
<!-- declarative-schema-command-result case="276-pg-graphql-comments-inflection" engine="next" command="sync-verification" status="ERROR" -->

### Transition fallback (legacy)

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
- Duration: `0.9s`

### Clear local runtime before baseline (legacy)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `31.6s`

### Establish baseline (legacy)

- Command: `npx supabase db schema declarative sync --apply --name 276_pg_graphql_comments_inflection_baseline --debug`
- Result: **ERROR**
- Duration: `64.1s`
- Exit code: `1`

```text
NotFound: FileSystem.readFile (C:\Users\Arcure\.supabase\profile)
Using pg-delta legacy implementation.
Creating shadow database...
Initialising schema...
+ ulimit -n
+ '[' -n '' ']'
+ export ERL_CRASH_DUMP=/tmp/erl_crash.dump
+ ERL_CRASH_DUMP=/tmp/erl_crash.dump
+ '[' false = true ']'
+ [[ -n '' ]]
+ echo 'Running migrations'
+ sudo -E -u nobody /app/bin/migrate
+ '[' true = true ']'
+ echo 'Seeding selfhosted Realtime'
+ sudo -E -u nobody /app/bin/realtime eval 'Realtime.Release.seeds(Realtime.Repo)'
[os_mon] memory supervisor port (memsup): Erlang has closed
[os_mon] cpu supervisor port (cpu_sup): Erlang has closed
+ echo 'Starting Realtime'
+ ulimit -n
+ exec /app/bin/realtime eval '{:ok, _} = Application.ensure_all_started(:realtime)
{:ok, _} = Realtime.Tenants.health_check("realtime-dev")'
[os_mon] memory supervisor port (memsup): Erlang has closed
[os_mon] cpu supervisor port (cpu_sup): Erlang has closed
Seeding globals from roles.sql...
Creating shadow database...
Initialising schema...
+ ulimit -n
+ '[' -n '' ']'
+ export ERL_CRASH_DUMP=/tmp/erl_crash.dump
+ ERL_CRASH_DUMP=/tmp/erl_crash.dump
+ '[' false = true ']'
+ [[ -n '' ]]
+ echo 'Running migrations'
+ sudo -E -u nobody /app/bin/migrate
+ '[' true = true ']'
+ echo 'Seeding selfhosted Realtime'
+ sudo -E -u nobody /app/bin/realtime eval 'Realtime.Release.seeds(Realtime.Repo)'
[os_mon] memory supervisor port (memsup): Erlang has closed
[os_mon] cpu supervisor port (cpu_sup): Erlang has closed
+ echo 'Starting Realtime'
+ ulimit -n
+ exec /app/bin/realtime eval '{:ok, _} = Application.ensure_all_started(:realtime)
{:ok, _} = Realtime.Tenants.health_check("realtime-dev")'
[os_mon] memory supervisor port (memsup): Erlang has closed
[os_mon] cpu supervisor port (cpu_sup): Erlang has closed
Seeding globals from roles.sql...
Applying declarative schemas via pg-delta...
Applied 8 statements in 1 round(s).
Generated migration SQL:
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net;

CREATE EXTENSION pg_graphql WITH SCHEMA graphql;

CREATE TABLE public.graphql_notes_276 (
  id    bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  label text   NOT NULL
);

COMMENT ON TABLE public.graphql_notes_276 IS 'case 276 baseline table';

COMMENT ON COLUMN public.graphql_notes_276.label IS 'case 276 baseline label';

ALTER TABLE public.graphql_notes_276
  ADD CONSTRAINT graphql_notes_276_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.graphql_notes_276 TO anon;

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.graphql_notes_276 TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.graphql_notes_276 TO service_role;

CREATE TABLE public.transition_anchor (
  case_no integer NOT NULL,
  payload text    NOT NULL
);

ALTER TABLE public.transition_anchor
  ADD CONSTRAINT transition_anchor_pkey PRIMARY KEY (case_no);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO service_role;
Created new migration at E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\276-pg-graphql-comments-inflection-legacy\supabase\migrations\20260818001014_276_pg_graphql_comments_inflection_baseline.sql
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

Debug information saved to E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\276-pg-graphql-comments-inflection-legacy\supabase\.temp\pgdelta\debug\20260818-001014-apply-error

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
The declarative baseline failed, so the change pg_graphql comment directives and verify table and column inflection transition was skipped.
```
<!-- declarative-schema-command-result case="276-pg-graphql-comments-inflection" engine="legacy" command="sync" status="ERROR" -->

