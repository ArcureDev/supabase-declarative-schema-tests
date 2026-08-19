# Case: 211-cast-operator-transform-creation

## Baseline state A

```sql
create table public.transition_anchor (
  id bigint generated always as identity primary key,
  label text not null
);

create type public.transition_scalar as (
  amount integer
);

create function public.transition_scalar_to_integer(value public.transition_scalar)
returns integer
language sql
immutable
strict
as $$
  select value.amount
$$;

create function public.transition_near(
  left_value integer,
  right_value integer
)
returns boolean
language sql
immutable
strict
as $$
  select abs(left_value - right_value) <= 1
$$;
```

## Desired state B

```sql
create table public.transition_anchor (
  id bigint generated always as identity primary key,
  label text not null
);

create type public.transition_scalar as (
  amount integer
);

create function public.transition_scalar_to_integer(value public.transition_scalar)
returns integer
language sql
immutable
strict
as $$
  select value.amount
$$;

create function public.transition_near(
  left_value integer,
  right_value integer
)
returns boolean
language sql
immutable
strict
as $$
  select abs(left_value - right_value) <= 1
$$;

create function public.transition_scalar_from_sql(internal)
returns internal
language internal
immutable
strict
as 'textlike_support';

create cast (public.transition_scalar as integer)
with function public.transition_scalar_to_integer(public.transition_scalar)
as assignment;

create operator public.~= (
  leftarg = integer,
  rightarg = integer,
  function = public.transition_near
);

create transform for public.transition_scalar language plpgsql (
  from sql with function public.transition_scalar_from_sql(internal)
);
```

## Representative data setup

```sql
insert into public.transition_anchor (label) values ('211');
```

## CLI-generated baseline migration files

_(no files generated)_

## Expected-unsupported diagnostic assertion

- Raw sync result: **ERROR**
- Assertion: **OK**
- The unsupported capability produced its required stable diagnostic without destructive SQL or sensitive output.

## Generated transition migration files

_(no files generated)_

## Raw transition diagnostic evidence

```text
The unsupported capability produced its required stable diagnostic without destructive SQL or sensitive output.
Raw sync status: ERROR
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

Debug information saved to E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\211-cast-operator-transform-creation\supabase\.temp\pgdelta\debug\20260817-181423

To report this issue, you can:
  1. Open an issue at https://github.com/supabase/pg-toolbelt/issues
     Attach the files from the debug folder above.
  2. Open a support ticket at https://supabase.com/dashboard/support
     (only visible to Supabase employees)

WARNING: The debug folder may contain sensitive information about your
database schema, including table structures, function definitions, and role
configurations. Review the contents carefully before sharing publicly.
If unsure, prefer opening a support ticket (option 2) instead.
Declarative schema planning failed: shadow load stuck after 3 round(s): 2 file(s) cannot apply
  - 6__cast-operator-transform-creation.sql: function public.transition_scalar_from_sql(internal) does not exist (failed identically in 3 round(s) — likely a genuine missing dependency, not ordering)
  - 9__cast-operator-transform-creation.sql: permission denied for language internal (failed identically in 3 round(s) — likely a genuine missing dependency, not ordering)
No migration SQL was generated.
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

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

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
- Duration: `39.5s`
<!-- declarative-schema-command-result case="211-cast-operator-transform-creation" engine="next" command="sync" status="OK" -->

## Verify unchanged state after unsupported planning

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`
<!-- declarative-schema-command-result case="211-cast-operator-transform-creation" engine="next" command="sync-verification" status="OK" -->

