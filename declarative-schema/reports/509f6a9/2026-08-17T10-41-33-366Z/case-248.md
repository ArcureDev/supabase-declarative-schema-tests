# Case: 248-extension-absence-version-diagnostic

## Baseline state A

```sql
create schema if not exists extensions;

create extension if not exists hstore
with schema extensions;

create table public.transition_anchor_248 (
  case_no integer primary key,
  payload text not null
);

create table public.extension_snapshot_248 (
  id integer primary key,
  extension_oid oid not null,
  installed_version text not null
);
```

## Desired state B

```sql
create schema if not exists extensions;

-- Deliberately unavailable: the fixture requires a stable version diagnostic.
create extension hstore
with schema extensions
version '0.0.0-ds-missing-248';

create table public.transition_anchor_248 (
  case_no integer primary key,
  payload text not null
);

create table public.extension_snapshot_248 (
  id integer primary key,
  extension_oid oid not null,
  installed_version text not null
);
```

## Representative data setup

```sql
insert into public.transition_anchor_248 (case_no, payload)
values (248, 'extension-version-diagnostic');

insert into public.extension_snapshot_248 (
  id,
  extension_oid,
  installed_version
)
select 1, oid, extversion
from pg_extension
where extname = 'hstore';
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

Debug information saved to E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\248-extension-absence-version-diagnostic\supabase\.temp\pgdelta\debug\20260817-220130

To report this issue, you can:
  1. Open an issue at https://github.com/supabase/pg-toolbelt/issues
     Attach the files from the debug folder above.
  2. Open a support ticket at https://supabase.com/dashboard/support
     (only visible to Supabase employees)

WARNING: The debug folder may contain sensitive information about your
database schema, including table structures, function definitions, and role
configurations. Review the contents carefully before sharing publicly.
If unsure, prefer opening a support ticket (option 2) instead.
Declarative schema planning failed: shadow load stuck after 2 round(s): 1 file(s) cannot apply
  - 1__extension-absence-version-diagnostic.sql: extension "hstore" has no installation script nor update path for version "0.0.0-ds-missing-248" (failed identically in 2 round(s) — likely a genuine missing dependency, not ordering)
No migration SQL was generated.
```

## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `1.0s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `32.0s`


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
- Duration: `40.0s`
<!-- declarative-schema-command-result case="248-extension-absence-version-diagnostic" engine="next" command="sync" status="OK" -->

## Verify unchanged state after unsupported planning

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`
<!-- declarative-schema-command-result case="248-extension-absence-version-diagnostic" engine="next" command="sync-verification" status="OK" -->

