# Case: 234-postgis-index-addition

## Baseline state A

```sql
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists postgis with schema extensions;
create table public.places_234 (
  id bigint generated always as identity primary key,
  name text not null,
  location extensions.geography(point, 4326) not null
);
```

## Desired state B

```sql
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists postgis with schema extensions;
create table public.places_234 (
  id bigint generated always as identity primary key,
  name text not null,
  location extensions.geography(point, 4326) not null
);
create index transition_places_gist_234
  on public.places_234
  using gist (location extensions.gist_geography_ops);
```

## Representative data setup

```sql
insert into public.transition_anchor (case_no, payload)
values (234, 'case-234');

insert into public.places_234 (name, location)
values
  (
    'Amsterdam',
    extensions.st_setsrid(extensions.st_makepoint(4.9041, 52.3676), 4326)
      ::extensions.geography
  ),
  (
    'Paris',
    extensions.st_setsrid(extensions.st_makepoint(2.3522, 48.8566), 4326)
      ::extensions.geography
  );
```

## CLI-generated baseline migration files

### `20260817201933_234_postgis_index_addition_baseline.sql`

```sql
set local check_function_bodies = off;

create extension "postgis" schema "extensions";

create table "public"."places_234" (
  "id"       bigint                           generated always as identity not null,
  "name"     text                             not null,
  "location" extensions.geography(Point,4326) not null,
  constraint "places_234_pkey" primary key (id)
);

create table "public"."transition_anchor" (
  "case_no" integer not null,
  "payload" text    not null,
  constraint "transition_anchor_pkey" primary key (case_no)
);

comment on extension "postgis" is 'PostGIS geometry and geography spatial types and functions';

grant maintain, references, trigger, truncate on table "public"."places_234" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."places_234" to "postgres";

grant maintain, references, trigger, truncate on table "public"."places_234" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **ERROR**
- Assertion: **ERROR**
- The generated migration did not satisfy its declared SQL-shape contract. Raw sync status was ERROR. No transition migration was generated. Missing operation(s): create the geography GiST index.

## Generated transition migration files

_(no files generated)_

## Raw transition diagnostic evidence

```text
The generated migration did not satisfy its declared SQL-shape contract. Raw sync status was ERROR. No transition migration was generated. Missing operation(s): create the geography GiST index.
NotFound: FileSystem.readFile (C:\Users\Arcure\.supabase\profile)
Using pg-delta next implementation.
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
Applying migration 20260817201933_234_postgis_index_addition_baseline.sql...
No migration SQL was generated.
```

## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.2s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 234_postgis_index_addition_baseline --debug`
- Result: **OK**
- Duration: `41.1s`

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
- Duration: `3669.0s`

```text
The generated migration did not satisfy its declared SQL-shape contract. Raw sync status was ERROR. No transition migration was generated. Missing operation(s): create the geography GiST index.
NotFound: FileSystem.readFile (C:\Users\Arcure\.supabase\profile)
Using pg-delta next implementation.
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
Applying migration 20260817201933_234_postgis_index_addition_baseline.sql...
No migration SQL was generated.
```
<!-- declarative-schema-command-result case="234-postgis-index-addition" engine="next" command="sync" status="ERROR" -->

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
<!-- declarative-schema-command-result case="234-postgis-index-addition" engine="next" command="sync-verification" status="ERROR" -->

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
- Duration: `5.4s`

### Clear local runtime before baseline (legacy)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `25.0s`

### Establish baseline (legacy)

- Command: `npx supabase db schema declarative sync --apply --name 234_postgis_index_addition_baseline --debug`
- Result: **ERROR**
- Duration: `49.1s`
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
Applied 5 statements in 1 round(s).
Generated migration SQL:
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net;

CREATE EXTENSION postgis WITH SCHEMA extensions;

CREATE TABLE public.places_234 (
  id       bigint                           GENERATED ALWAYS AS IDENTITY NOT NULL,
  name     text                             NOT NULL,
  location extensions.geography(Point,4326) NOT NULL
);

ALTER TABLE public.places_234
  ADD CONSTRAINT places_234_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.places_234 TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.places_234 TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.places_234 TO service_role;

CREATE TABLE public.transition_anchor (
  case_no integer NOT NULL,
  payload text    NOT NULL
);

ALTER TABLE public.transition_anchor
  ADD CONSTRAINT transition_anchor_pkey PRIMARY KEY (case_no);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO service_role;
Created new migration at E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\234-postgis-index-addition-legacy\supabase\migrations\20260817212202_234_postgis_index_addition_baseline.sql
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

Debug information saved to E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\234-postgis-index-addition-legacy\supabase\.temp\pgdelta\debug\20260817-212202-apply-error

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
The declarative baseline failed, so the add a GiST index to populated PostGIS geography data transition was skipped.
```
<!-- declarative-schema-command-result case="234-postgis-index-addition" engine="legacy" command="sync" status="ERROR" -->

