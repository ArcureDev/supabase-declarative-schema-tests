# Case: 218-role-membership-acl-hardening

## Baseline state A

```sql
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create role transition_parent_218
  nologin nosuperuser nocreatedb nocreaterole inherit noreplication nobypassrls;
create role transition_member_218
  nologin nosuperuser nocreatedb nocreaterole inherit noreplication nobypassrls
  connection limit -1;

grant transition_parent_218 to transition_member_218;

create table public.role_acl_218 (
  id bigint generated always as identity primary key,
  tenant_name text not null,
  body text not null
);

alter table public.role_acl_218 enable row level security;

create policy transition_role_select_218
on public.role_acl_218
for select
to transition_parent_218
using (tenant_name = current_user);

grant select on table public.role_acl_218 to transition_parent_218;
```

## Desired state B

```sql
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create role transition_parent_218
  nologin nosuperuser nocreatedb nocreaterole inherit noreplication nobypassrls;
create role transition_member_218
  nologin nosuperuser nocreatedb nocreaterole inherit noreplication nobypassrls
  connection limit 3;

grant transition_parent_218 to transition_member_218 with admin option;

create table public.role_acl_218 (
  id bigint generated always as identity primary key,
  tenant_name text not null,
  body text not null
);

alter table public.role_acl_218 enable row level security;

create policy transition_role_select_218
on public.role_acl_218
for select
to transition_parent_218
using (tenant_name = current_user);

grant select, update on table public.role_acl_218 to transition_parent_218;
```

## Representative data setup

```sql
insert into public.transition_anchor (case_no, payload)
values (218, 'case-218');

insert into public.role_acl_218 (tenant_name, body)
values ('transition_parent_218', 'protected role row');
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

Debug information saved to E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\218-role-membership-acl-hardening\supabase\.temp\pgdelta\debug\20260817-193336

To report this issue, you can:
  1. Open an issue at https://github.com/supabase/pg-toolbelt/issues
     Attach the files from the debug folder above.
  2. Open a support ticket at https://supabase.com/dashboard/support
     (only visible to Supabase employees)

WARNING: The debug folder may contain sensitive information about your
database schema, including table structures, function definitions, and role
configurations. Review the contents carefully before sharing publicly.
If unsure, prefer opening a support ticket (option 2) instead.
Declarative schema planning failed: scope database does not manage cluster-global roles, but found cluster DDL:
  role-membership-acl-hardening.sql: CREATE ROLE, CREATE ROLE, GRANT (role membership)
Use scope cluster (with an isolated shadow) to manage roles, or skipClusterDdl to skip these statements.
No migration SQL was generated.
```

## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.1s`


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
- Duration: `58.4s`
<!-- declarative-schema-command-result case="218-role-membership-acl-hardening" engine="next" command="sync" status="OK" -->

## Verify unchanged state after unsupported planning

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`
<!-- declarative-schema-command-result case="218-role-membership-acl-hardening" engine="next" command="sync-verification" status="OK" -->

