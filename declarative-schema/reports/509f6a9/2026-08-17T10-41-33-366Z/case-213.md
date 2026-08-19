# Case: 213-routine-procedure-replacement

## Baseline state A

```sql
create table public.transition_anchor (
  id bigint generated always as identity primary key,
  label text not null
);

create table public.transition_call_log (
  id bigint generated always as identity primary key,
  body text not null
);

create function public.transition_compute(input_value integer)
returns integer
language sql
stable
strict
as $$
  select input_value + 1
$$;

create procedure public.transition_record(input_body text)
language sql
as $$
  insert into public.transition_call_log (body) values (input_body)
$$;
```

## Desired state B

```sql
create table public.transition_anchor (
  id bigint generated always as identity primary key,
  label text not null
);

create table public.transition_call_log (
  id bigint generated always as identity primary key,
  body text not null
);

create function public.transition_compute(input_value integer)
returns integer
language sql
immutable
strict
as $$
  select input_value + 2
$$;

create procedure public.transition_record(input_body text)
language sql
as $$
  insert into public.transition_call_log (body) values (upper(input_body))
$$;
```

## Representative data setup

```sql
insert into public.transition_anchor (label) values ('213');
call public.transition_record('before');
```

## CLI-generated baseline migration files

### `20260817181819_213_routine_procedure_replacement_baseline.sql`

```sql
set local check_function_bodies = off;

create table "public"."transition_anchor" (
  "id"    bigint generated always as identity not null,
  "label" text   not null,
  constraint "transition_anchor_pkey" primary key (id)
);

create table "public"."transition_call_log" (
  "id"   bigint generated always as identity not null,
  "body" text   not null,
  constraint "transition_call_log_pkey" primary key (id)
);

create or replace function public.transition_compute (
  input_value integer
)
  returns integer
  language sql
  stable
  strict
  AS $function$
  select input_value + 1
$function$;

create or replace procedure public.transition_record (
  IN input_body text
)
  language sql
  AS $procedure$
  insert into public.transition_call_log (body) values (input_body)
$procedure$;

grant execute on function "public"."transition_compute"(integer) to public, "postgres";

grant execute on procedure "public"."transition_record"(text) to public, "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_call_log" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_call_log" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_call_log" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260817181859_declarative_sync.sql`

```sql
set local check_function_bodies = off;

create or replace function public.transition_compute (
  input_value integer
)
  returns integer
  language sql
  immutable
  strict
  AS $function$
  select input_value + 2
$function$;

create or replace procedure public.transition_record (
  IN input_body text
)
  language sql
  AS $procedure$
  insert into public.transition_call_log (body) values (upper(input_body))
$procedure$;
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.3s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 213_routine_procedure_replacement_baseline --debug`
- Result: **OK**
- Duration: `39.9s`

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
<!-- declarative-schema-command-result case="213-routine-procedure-replacement" engine="next" command="sync" status="OK" -->

## Apply generated transition migration

- Command: `npx supabase migration up --local --debug`
- Result: **OK**
- Duration: `0.6s`

## Verify desired state B

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **ERROR**
- Duration: `3638.7s`

```text
NotFound: FileSystem.readFile (C:\Users\Arcure\.supabase\profile)
Using pg-delta next implementation.
```
<!-- declarative-schema-command-result case="213-routine-procedure-replacement" engine="next" command="sync-verification" status="ERROR" -->

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
- Duration: `3.8s`

### Clear local runtime before baseline (legacy)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `24.7s`

### Establish baseline (legacy)

- Command: `npx supabase db schema declarative sync --apply --name 213_routine_procedure_replacement_baseline --debug`
- Result: **ERROR**
- Duration: `44.7s`
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
[os_mon] cpu supervisor port (cpu_sup): Erlang has closed
[os_mon] memory supervisor port (memsup): Erlang has closed
+ echo 'Starting Realtime'
+ ulimit -n
+ exec /app/bin/realtime eval '{:ok, _} = Application.ensure_all_started(:realtime)
{:ok, _} = Realtime.Tenants.health_check("realtime-dev")'
[os_mon] memory supervisor port (memsup): Erlang has closed
[os_mon] cpu supervisor port (cpu_sup): Erlang has closed
Seeding globals from roles.sql...
Applying declarative schemas via pg-delta...
Applied 6 statements in 1 round(s).
Generated migration SQL:
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

SET check_function_bodies = false;

DROP EXTENSION pg_net;

CREATE FUNCTION public.transition_compute (
  input_value integer
)
  RETURNS integer
  LANGUAGE sql
  STABLE
  STRICT
  AS $function$
  select input_value + 1
$function$;

CREATE PROCEDURE public.transition_record (
  IN input_body text
)
  LANGUAGE sql
  AS $procedure$
  insert into public.transition_call_log (body) values (input_body)
$procedure$;

CREATE TABLE public.transition_anchor (
  id    bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  label text   NOT NULL
);

ALTER TABLE public.transition_anchor
  ADD CONSTRAINT transition_anchor_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO service_role;

CREATE TABLE public.transition_call_log (
  id   bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  body text   NOT NULL
);

ALTER TABLE public.transition_call_log
  ADD CONSTRAINT transition_call_log_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_call_log TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_call_log TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_call_log TO service_role;
Created new migration at E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\213-routine-procedure-replacement-legacy\supabase\migrations\20260817192054_213_routine_procedure_replacement_baseline.sql
Found drop statements in schema diff. Please double check if these are expected:
DROP EXTENSION pg_net
Migration failed to apply: ERROR: extension "pg_net" does not exist (SQLSTATE 42704)
At statement: 1
DROP EXTENSION pg_net

Debug information saved to E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\213-routine-procedure-replacement-legacy\supabase\.temp\pgdelta\debug\20260817-192054-apply-error

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
At statement: 1
DROP EXTENSION pg_net
```

### Sync (legacy)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
The declarative baseline failed, so the in-place SQL function and procedure replacement transition was skipped.
```
<!-- declarative-schema-command-result case="213-routine-procedure-replacement" engine="legacy" command="sync" status="ERROR" -->

