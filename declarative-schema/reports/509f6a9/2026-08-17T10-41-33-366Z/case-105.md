# Case: 105-custom-operator-class

## Fixture migration SQL

```sql
create function public.int4_custom_cmp(a integer, b integer)
returns integer
language sql
immutable
strict
as $$
  select case
    when a < b then -1
    when a > b then 1
    else 0
  end;
$$;

create operator class public.int4_custom_ops
for type integer using btree as
  operator 1 <(integer, integer),
  operator 2 <=(integer, integer),
  operator 3 =(integer, integer),
  operator 4 >=(integer, integer),
  operator 5 >(integer, integer),
  function 1 public.int4_custom_cmp(integer, integer);
```

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **ERROR**
- Duration: `21.4s`
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
Applying migration 20260101000000_case.sql...
ERROR: must be superuser to create an operator class (SQLSTATE 42501)
At statement: 1
create operator class public.int4_custom_ops
for type integer using btree as
  operator 1 <(integer, integer),
  operator 2 <=(integer, integer),
  operator 3 =(integer, integer),
  operator 4 >=(integer, integer),
  operator 5 >(integer, integer),
  function 1 public.int4_custom_cmp(integer, integer)
```

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Database reset failed, so declarative generation was skipped.
```
<!-- declarative-schema-command-result case="105-custom-operator-class" engine="next" command="generate" status="ERROR" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Generate failed, so declarative sync was skipped.
```
<!-- declarative-schema-command-result case="105-custom-operator-class" engine="next" command="sync" status="ERROR" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **ERROR**
- Duration: `0.5s`
- Exit code: `1`

```text
NotFound: FileSystem.readFile (C:\Users\Arcure\.supabase\profile)
Using pg-delta next implementation.
no declarative schema found. Run supabase db schema declarative generate first
```
<!-- declarative-schema-command-result case="105-custom-operator-class" engine="next" command="sync-verification" status="ERROR" -->

