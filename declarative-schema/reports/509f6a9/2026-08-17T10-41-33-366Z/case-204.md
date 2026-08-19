# Case: 204-index-definition-evolution

## Baseline state A

```sql
create table public.transition_anchor (
  id integer primary key,
  payload text not null
);

create table public.index_evolution (
  id bigint primary key,
  code text not null,
  category text not null,
  score integer not null,
  payload text not null,
  active boolean not null
);

create index index_evolution_code_old_idx
  on public.index_evolution (code);

create index index_evolution_lookup_idx
  on public.index_evolution (category, score asc nulls last)
  include (payload)
  with (fillfactor = 80)
  where active;

create index index_evolution_retired_idx
  on public.index_evolution (score);
```

## Desired state B

```sql
create table public.transition_anchor (
  id integer primary key,
  payload text not null
);

create table public.index_evolution (
  id bigint primary key,
  code text not null,
  category text not null,
  score integer not null,
  payload text not null,
  active boolean not null
);

create index index_evolution_code_old_idx
  on public.index_evolution (code);

create unique index index_evolution_lookup_idx
  on public.index_evolution (
    category text_pattern_ops asc nulls last,
    (lower(code)) collate "C" text_pattern_ops desc nulls first
  )
  include (score, payload)
  with (fillfactor = 70)
  where active and score > 0;

create index index_evolution_hash_idx
  on public.index_evolution using hash (code);
```

## Representative data setup

```sql
insert into public.transition_anchor values (1, 'preserved');
insert into public.index_evolution values
  (1, 'Alpha', 'a', 10, 'one', true),
  (2, 'Beta', 'b', 20, 'two', true),
  (3, 'Gamma', 'c', 0, 'three', false);
```

## CLI-generated baseline migration files

### `20260817175422_204_index_definition_evolution_baseline.sql`

```sql
create table "public"."index_evolution" (
  "id"       bigint  not null,
  "code"     text    not null,
  "category" text    not null,
  "score"    integer not null,
  "payload"  text    not null,
  "active"   boolean not null,
  constraint "index_evolution_pkey" primary key (id)
);

create table "public"."transition_anchor" (
  "id"      integer not null,
  "payload" text    not null,
  constraint "transition_anchor_pkey" primary key (id)
);

create index index_evolution_code_old_idx on public.index_evolution using btree (code);

create index index_evolution_lookup_idx on public.index_evolution using btree (category, score) include (payload)
  with (fillfactor='80')
  where active;

create index index_evolution_retired_idx on public.index_evolution using btree (score);

grant maintain, references, trigger, truncate on table "public"."index_evolution" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."index_evolution" to "postgres";

grant maintain, references, trigger, truncate on table "public"."index_evolution" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260817175502_declarative_sync.sql`

```sql
drop index "public"."index_evolution_lookup_idx";

drop index "public"."index_evolution_retired_idx";

create index index_evolution_hash_idx on public.index_evolution using hash (code);

create unique index index_evolution_lookup_idx on public.index_evolution using btree (category text_pattern_ops, lower(code) collate "C" text_pattern_ops desc)
  include (score, payload)
  with (fillfactor='70')
  where (active AND (score > 0));
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.0s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 204_index_definition_evolution_baseline --debug`
- Result: **OK**
- Duration: `59.6s`

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
- Duration: `39.8s`
<!-- declarative-schema-command-result case="204-index-definition-evolution" engine="next" command="sync" status="OK" -->

## Apply generated transition migration

- Command: `npx supabase migration up --local --debug`
- Result: **OK**
- Duration: `0.6s`

## Verify desired state B

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **ERROR**
- Duration: `0.1s`
- Exit code: `0`

```text
index create, drop, uniqueness, method, multicolumn expression, ordering, collation, operator class, INCLUDE, predicate, and storage-option evolution did not preserve identity or satisfy its catalog/data checks.
Baseline verification:
{"identity" : "17718", "valid" : true}
Desired-state verification:
{"identity" : "17718", "valid" : false}
```

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Desired state B verification failed, so convergence was not checked.
```
<!-- declarative-schema-command-result case="204-index-definition-evolution" engine="next" command="sync-verification" status="ERROR" -->

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
- Duration: `1.0s`

### Clear local runtime before baseline (legacy)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `22.0s`

### Establish baseline (legacy)

- Command: `npx supabase db schema declarative sync --apply --name 204_index_definition_evolution_baseline --debug`
- Result: **ERROR**
- Duration: `62.8s`
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
Applied 7 statements in 1 round(s).
Generated migration SQL:
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net;

CREATE TABLE public.index_evolution (
  id       bigint  NOT NULL,
  code     text    NOT NULL,
  category text    NOT NULL,
  score    integer NOT NULL,
  payload  text    NOT NULL,
  active   boolean NOT NULL
);

ALTER TABLE public.index_evolution
  ADD CONSTRAINT index_evolution_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.index_evolution TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.index_evolution TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.index_evolution TO service_role;

CREATE INDEX index_evolution_lookup_idx ON public.index_evolution (category, score) INCLUDE (payload
  WITH (fillfactor='80')
  WHERE active;

CREATE INDEX index_evolution_retired_idx ON public.index_evolution (score);

CREATE INDEX index_evolution_code_old_idx ON public.index_evolution (code);

CREATE TABLE public.transition_anchor (
  id      integer NOT NULL,
  payload text    NOT NULL
);

ALTER TABLE public.transition_anchor
  ADD CONSTRAINT transition_anchor_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO service_role;
Created new migration at E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\204-index-definition-evolution-legacy\supabase\migrations\20260817175628_204_index_definition_evolution_baseline.sql
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

Debug information saved to E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\204-index-definition-evolution-legacy\supabase\.temp\pgdelta\debug\20260817-175628-apply-error

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
The declarative baseline failed, so the index create, drop, uniqueness, method, multicolumn expression, ordering, collation, operator class, INCLUDE, predicate, and storage-option evolution transition was skipped.
```
<!-- declarative-schema-command-result case="204-index-definition-evolution" engine="legacy" command="sync" status="ERROR" -->

