# Case: 342-notnull-staged

- Scenario pack: `Schemas, tables, columns, and sequences catalogue scenarios` / `notnull-staged`
- Catalogue atoms: `PG-CAT-STC-06::notnull.staged`

## Baseline state A

```sql
-- Covers PG-CAT-STC-06::notnull.staged. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_notnull_staged (
  id bigint primary key, label text
);
```

## Desired state B

```sql
-- Covers PG-CAT-STC-06::notnull.staged. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_notnull_staged (
  id bigint primary key, label text, extra text
);
```

## Representative data setup

```sql
insert into public.transition_anchor values (1, 'preserved');
```

## CLI-generated baseline migration files

_(no files generated)_

## Declared migration-shape assertion

- Raw sync result: **SKIPPED**
- Assertion: **SKIPPED**
- The safety assertion could not run because the declarative baseline failed.

## Generated transition migration files

_(no files generated)_

## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `1.0s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `31.6s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 342_notnull_staged_baseline --debug`
- Result: **ERROR**
- Duration: `20.8s`
- Exit code: `1`

```text
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

Debug information saved to E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\342-notnull-staged\supabase\.temp\pgdelta\debug\20260818-055727

To report this issue, you can:
  1. Open an issue at https://github.com/supabase/pg-toolbelt/issues
     Attach the files from the debug folder above.
  2. Open a support ticket at https://supabase.com/dashboard/support
     (only visible to Supabase employees)

WARNING: The debug folder may contain sensitive information about your
database schema, including table structures, function definitions, and role
configurations. Review the contents carefully before sharing publicly.
If unsure, prefer opening a support ticket (option 2) instead.
failed to start docker container "": Error response from daemon: ports are not available: exposing port TCP 0.0.0.0:62545 -> 127.0.0.1:0: listen tcp 0.0.0.0:62545: bind: Only one usage of each socket address (protocol/network address/port) is normally permitted.
failed to start containers: 0dd788d66908a6951bc9301ace83430b8c89b3d6688b47b1da9980647a3ad0a7
```


## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
The declarative baseline failed, so the apply notnull.staged with a native in-place operation transition was skipped.
```
<!-- declarative-schema-command-result case="342-notnull-staged" engine="next" command="sync" status="ERROR" -->

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
- Duration: `1.1s`

### Clear local runtime before baseline (legacy)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `32.9s`

### Establish baseline (legacy)

- Command: `npx supabase db schema declarative sync --apply --name 342_notnull_staged_baseline --debug`
- Result: **ERROR**
- Duration: `63.6s`
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
Applied 4 statements in 1 round(s).
Generated migration SQL:
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net;

CREATE TABLE public.catalogue_notnull_staged (
  id    bigint NOT NULL,
  label text
);

ALTER TABLE public.catalogue_notnull_staged
  ADD CONSTRAINT catalogue_notnull_staged_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_notnull_staged TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_notnull_staged TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_notnull_staged TO service_role;

CREATE TABLE public.transition_anchor (
  id      bigint NOT NULL,
  payload text   NOT NULL
);

ALTER TABLE public.transition_anchor
  ADD CONSTRAINT transition_anchor_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO service_role;
Created new migration at E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\342-notnull-staged-legacy\supabase\migrations\20260818055905_342_notnull_staged_baseline.sql
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

Debug information saved to E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\342-notnull-staged-legacy\supabase\.temp\pgdelta\debug\20260818-055905-apply-error

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
The declarative baseline failed, so the apply notnull.staged with a native in-place operation transition was skipped.
```
<!-- declarative-schema-command-result case="342-notnull-staged" engine="legacy" command="sync" status="ERROR" -->

