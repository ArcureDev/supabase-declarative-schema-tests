# Case: 278-wrappers-vault-credential-redaction

## Baseline state A

```sql
-- Invariant: declarations contain references and endpoints, never secret plaintext.
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists supabase_vault with schema vault;
create extension if not exists wrappers with schema extensions;
create foreign data wrapper transition_vault_wrapper_278
  handler extensions.wasm_fdw_handler
  validator extensions.wasm_fdw_validator;
create server transition_vault_server_278
  foreign data wrapper transition_vault_wrapper_278
  options (
    fdw_package_url 'https://packages.invalid/openapi_fdw.wasm',
    fdw_package_name 'supabase:openapi-fdw',
    fdw_package_version '0.2.0',
    fdw_package_checksum 'f0d4d6e50f7c519a66363bd8bdbe1ea8086ca810ca14b43fb0ed18b64acdf6aa',
    base_url 'https://vault-wrapper.invalid/v1'
  );
grant usage on foreign server transition_vault_server_278 to authenticated;
```

## Desired state B

```sql
-- Invariant: endpoint evolution cannot export or delete runtime credentials.
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists supabase_vault with schema vault;
create extension if not exists wrappers with schema extensions;
create foreign data wrapper transition_vault_wrapper_278
  handler extensions.wasm_fdw_handler
  validator extensions.wasm_fdw_validator;
create server transition_vault_server_278
  foreign data wrapper transition_vault_wrapper_278
  options (
    fdw_package_url 'https://packages.invalid/openapi_fdw.wasm',
    fdw_package_name 'supabase:openapi-fdw',
    fdw_package_version '0.2.0',
    fdw_package_checksum 'f0d4d6e50f7c519a66363bd8bdbe1ea8086ca810ca14b43fb0ed18b64acdf6aa',
    base_url 'https://vault-wrapper.invalid/v2'
  );
grant usage on foreign server transition_vault_server_278 to authenticated;
```

## Representative data setup

```sql
-- Invariant: the credential exists only as encrypted Vault runtime data.
insert into public.transition_anchor (case_no, payload)
values (278, 'case-278');

select vault.create_secret(
  '[REDACTED]',
  'transition_wrapper_credential_278',
  'runtime-only Wrappers credential'
);

do $setup$
declare
  credential_id uuid;
begin
  select id into strict credential_id
  from vault.secrets
  where name = 'transition_wrapper_credential_278';

  execute format(
    'alter server transition_vault_server_278 options (add api_key_id %L)',
    credential_id::text
  );
end
$setup$;
```

## CLI-generated baseline migration files

### `20260818001302_278_wrappers_vault_credential_redaction_baseline.sql`

```sql
create table "public"."transition_anchor" (
  "case_no" integer not null,
  "payload" text    not null,
  constraint "transition_anchor_pkey" primary key (case_no)
);

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **SKIPPED**
- Assertion: **SKIPPED**
- The safety assertion could not run because baseline setup or verification failed.

## Generated transition migration files

_(no files generated)_

## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `1.0s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `32.5s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 278_wrappers_vault_credential_redaction_baseline --debug`
- Result: **OK**
- Duration: `49.9s`

## Insert representative data

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **ERROR**
- Duration: `0.1s`
- Exit code: `3`

```text
INSERT 0 1
818ff899-ad58-416d-bb36-861043639e80
psql:<stdin>:24: ERROR:  server "transition_vault_server_278" does not exist
CONTEXT:  SQL statement "alter server transition_vault_server_278 options (add api_key_id '818ff899-ad58-416d-bb36-861043639e80')"
PL/pgSQL function inline_code_block line 9 at EXECUTE
```


## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
The declarative baseline failed, so the change a Wrappers endpoint while preserving a Vault-backed runtime credential transition was skipped.
```
<!-- declarative-schema-command-result case="278-wrappers-vault-credential-redaction" engine="next" command="sync" status="ERROR" -->

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
- Duration: `0.9s`

### Clear local runtime before baseline (legacy)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `32.6s`

### Establish baseline (legacy)

- Command: `npx supabase db schema declarative sync --apply --name 278_wrappers_vault_credential_redaction_baseline --debug`
- Result: **ERROR**
- Duration: `63.1s`
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
Applied 8 statements in 1 round(s).
Generated migration SQL:
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net;

GRANT ALL ON SERVER transition_vault_server_278 TO authenticated;

CREATE EXTENSION wrappers WITH SCHEMA extensions;

CREATE TABLE public.transition_anchor (
  case_no integer NOT NULL,
  payload text    NOT NULL
);

ALTER TABLE public.transition_anchor
  ADD CONSTRAINT transition_anchor_pkey PRIMARY KEY (case_no);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO service_role;
Created new migration at E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\278-wrappers-vault-credential-redaction-legacy\supabase\migrations\20260818001439_278_wrappers_vault_credential_redaction_baseline.sql
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

Debug information saved to E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\278-wrappers-vault-credential-redaction-legacy\supabase\.temp\pgdelta\debug\20260818-001439-apply-error

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
The declarative baseline failed, so the change a Wrappers endpoint while preserving a Vault-backed runtime credential transition was skipped.
```
<!-- declarative-schema-command-result case="278-wrappers-vault-credential-redaction" engine="legacy" command="sync" status="ERROR" -->

