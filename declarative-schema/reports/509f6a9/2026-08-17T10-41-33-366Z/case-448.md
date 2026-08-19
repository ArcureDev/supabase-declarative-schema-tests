# Case: 448-partition-key

- Scenario pack: `Partitions and inheritance catalogue scenarios` / `partition-key`
- Catalogue atoms: `PG-CAT-PRT-03::partition.key`

## Baseline state A

```sql
-- Covers PG-CAT-PRT-03::partition.key. Keep public.transition_anchor identity stable. This atom is an explicit supported/unsupported boundary, not an accidental omission.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_probe (
  id bigint primary key, label text
);
```

## Desired state B

```sql
-- Covers PG-CAT-PRT-03::partition.key. Keep public.transition_anchor identity stable. This atom is an explicit supported/unsupported boundary, not an accidental omission.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_probe (
  id bigint primary key, label text
);
-- Desired change for partition.key must be refused, not silently omitted.
```

## Representative data setup

```sql
insert into public.transition_anchor values (1, 'preserved');
```

## CLI-generated baseline migration files

_(no files generated)_

## Expected-unsupported diagnostic assertion

- Raw sync result: **SKIPPED**
- Assertion: **SKIPPED**
- The safety assertion did not run.

## Generated transition migration files

_(no files generated)_

## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.7s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **ERROR**
- Duration: `14.6s`
- Exit code: `1`

```text
NotFound: FileSystem.readFile (C:\Users\Arcure\.supabase\profile)
Resetting local database...
Recreating database...
Initialising schema...
+ ulimit -n
+ '[' -n '' ']'
+ export ERL_CRASH_DUMP=/tmp/erl_crash.dump
+ ERL_CRASH_DUMP=/tmp/erl_crash.dump
+ '[' false = true ']'
+ [[ -n '' ]]
+ echo 'Running migrations'
+ sudo -E -u nobody /app/bin/migrate
** (Ecto.ConstraintError) constraint error when attempting to insert struct:

    * "schema_migrations_pkey" (unique_constraint)

If you would like to stop this constraint violation from raising an
exception and instead add it as an error to your changeset, please
call `unique_constraint/3` on your changeset with the constraint
`:name` as an option.

The changeset has not defined any constraint.

    (ecto 3.13.6) lib/ecto/repo/schema.ex:1052: anonymous fn/4 in Ecto.Repo.Schema.constraints_to_errors/3
    (elixir 1.19.5) lib/enum.ex:1688: Enum."-map/2-lists^map/1-1-"/2
    (ecto 3.13.6) lib/ecto/repo/schema.ex:1035: Ecto.Repo.Schema.constraints_to_errors/3
    (ecto 3.13.6) lib/ecto/repo/schema.ex:1005: Ecto.Repo.Schema.apply/4
    (ecto 3.13.6) lib/ecto/repo/schema.ex:500: anonymous fn/15 in Ecto.Repo.Schema.do_insert/4
    (ecto_sql 3.13.2) lib/ecto/migrator.ex:338: anonymous fn/6 in Ecto.Migrator.async_migrate_maybe_in_transaction/7
    (ecto_sql 3.13.2) lib/ecto/migrator.ex:352: Ecto.Migrator.run_maybe_in_transaction/5
error running container: exit 1
```


## Establish baseline with declarative sync --apply

- Command: `docker exec ... psql --file -`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
The baseline reset failed, so direct bootstrap was skipped.
```


## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Baseline bootstrap failed, so unsupported-capability planning was skipped.
```
<!-- declarative-schema-command-result case="448-partition-key" engine="next" command="sync" status="ERROR" -->

### Transition fallback (legacy)

- Overall result: **FAILED**
- Raw sync result: **OK**
- Assertion: **ERROR**
- The unsupported capability did not satisfy its diagnostic contract. Raw sync unexpectedly completed with status OK; promote this fixture to applicable-transition if support is intentional. Missing diagnostic(s): reports a stable capability or scope diagnostic.

### Legacy-generated baseline migration files

_(no files generated)_

### Legacy-generated transition migration files

### `20260818121517_declarative_sync.sql`

```sql
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net;

CREATE TABLE public.catalogue_probe (
  id    bigint NOT NULL,
  label text
);

ALTER TABLE public.catalogue_probe
  ADD CONSTRAINT catalogue_probe_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_probe TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_probe TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_probe TO service_role;

CREATE TABLE public.transition_anchor (
  id      bigint NOT NULL,
  payload text   NOT NULL
);

ALTER TABLE public.transition_anchor
  ADD CONSTRAINT transition_anchor_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO service_role;
```


### Start local runtime (legacy)

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.8s`

### Clear local runtime before baseline (legacy)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `33.5s`

### Establish baseline (legacy)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

### Insert representative data (legacy)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

### Capture baseline state (legacy)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

### Sync (legacy)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **ERROR**
- Duration: `44.6s`
- Exit code: `0`

```text
The unsupported capability did not satisfy its diagnostic contract. Raw sync unexpectedly completed with status OK; promote this fixture to applicable-transition if support is intentional. Missing diagnostic(s): reports a stable capability or scope diagnostic.
Raw sync status: OK
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
Applied 4 statements in 1 round(s).
Generated migration SQL:
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net;

CREATE TABLE public.catalogue_probe (
  id    bigint NOT NULL,
  label text
);

ALTER TABLE public.catalogue_probe
  ADD CONSTRAINT catalogue_probe_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_probe TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_probe TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_probe TO service_role;

CREATE TABLE public.transition_anchor (
  id      bigint NOT NULL,
  payload text   NOT NULL
);

ALTER TABLE public.transition_anchor
  ADD CONSTRAINT transition_anchor_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO service_role;
Created new migration at E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\448-partition-key-legacy\supabase\migrations\20260818121517_declarative_sync.sql
Found drop statements in schema diff. Please double check if these are expected:
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net
A new version of Supabase CLI is available: v2.115.0 (currently installed v0.0.0-pr.6102)
We recommend updating regularly for new features and bug fixes: https://supabase.com/docs/guides/cli/getting-started#updating-the-supabase-cli
Generated migration SQL:
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net;

CREATE TABLE public.catalogue_probe (
  id    bigint NOT NULL,
  label text
);

ALTER TABLE public.catalogue_probe
  ADD CONSTRAINT catalogue_probe_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_probe TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_probe TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_probe TO service_role;

CREATE TABLE public.transition_anchor (
  id      bigint NOT NULL,
  payload text   NOT NULL
);

ALTER TABLE public.transition_anchor
  ADD CONSTRAINT transition_anchor_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO service_role;
```
<!-- declarative-schema-command-result case="448-partition-key" engine="legacy" command="sync" status="ERROR" -->

### Sync verification / convergence (legacy)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`
<!-- declarative-schema-command-result case="448-partition-key" engine="legacy" command="sync-verification" status="OK" -->

