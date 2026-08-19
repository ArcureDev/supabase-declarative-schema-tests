# Case: 129-object-ownership-transfer

## Fixture migration SQL

```sql
create role fixture_object_owner nologin;

grant fixture_object_owner to current_user;
grant usage, create on schema public to fixture_object_owner;

create table public.reassigned_items (
  id bigint generated always as identity primary key,
  label text not null
);

alter table public.reassigned_items owner to fixture_object_owner;
```

## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.7s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `0.9s`
<!-- declarative-schema-command-result case="129-object-ownership-transfer" engine="next" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **ERROR**
- Duration: `39.6s`
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

Debug information saved to E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\129-object-ownership-transfer\supabase\.temp\pgdelta\debug\20260817-150637

To report this issue, you can:
  1. Open an issue at https://github.com/supabase/pg-toolbelt/issues
     Attach the files from the debug folder above.
  2. Open a support ticket at https://supabase.com/dashboard/support
     (only visible to Supabase employees)

WARNING: The debug folder may contain sensitive information about your
database schema, including table structures, function definitions, and role
configurations. Review the contents carefully before sharing publicly.
If unsure, prefer opening a support ticket (option 2) instead.
Declarative schema planning failed: shadow load stuck after 2 round(s): 5 file(s) cannot apply
  - 03__public/tables/reassigned_items.sql: role "fixture_object_owner" does not exist (failed identically in 2 round(s) — likely a genuine missing dependency, not ordering)
  - 13__public/schema.sql: role "fixture_object_owner" does not exist (failed identically in 2 round(s) — likely a genuine missing dependency, not ordering)
  - 14__public/schema.sql: role "fixture_object_owner" does not exist (failed identically in 2 round(s) — likely a genuine missing dependency, not ordering)
  - 23__public/tables/reassigned_items.sql: role "fixture_object_owner" does not exist (failed identically in 2 round(s) — likely a genuine missing dependency, not ordering)
  - 24__public/tables/reassigned_items.sql: role "fixture_object_owner" does not exist (failed identically in 2 round(s) — likely a genuine missing dependency, not ordering)
```
<!-- declarative-schema-command-result case="129-object-ownership-transfer" engine="next" command="sync" status="ERROR" -->

