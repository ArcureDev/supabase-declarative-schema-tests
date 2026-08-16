# Case: 307-move-table

- Scenario pack: `Schemas, tables, columns, and sequences catalogue scenarios` / `move-table`
- Catalogue atoms: `PG-CAT-STC-02::move.table`

## Baseline state A

```sql
-- Covers PG-CAT-STC-02::move.table. Keep public.transition_anchor identity stable. PostgreSQL RENAME/SET SCHEMA preserves OIDs; an unhinted declarative pair must not silently drop data.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_rename_source (
  id bigint primary key, label text
);
```

## Desired state B

```sql
-- Covers PG-CAT-STC-02::move.table. Keep public.transition_anchor identity stable. PostgreSQL RENAME/SET SCHEMA preserves OIDs; an unhinted declarative pair must not silently drop data.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_rename_target (
  id bigint primary key, label text
);
```

## Representative data setup

```sql
insert into public.transition_anchor values (1, 'preserved');
```

## CLI-generated baseline migration files

_(no files generated)_

## Rename-ambiguity safety assertion

- Raw sync result: **SKIPPED**
- Assertion: **SKIPPED**
- The safety assertion could not run because the declarative baseline failed.

## Generated transition migration files

_(no files generated)_

## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **ERROR**
- Duration: `16.0s`
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
** (Ecto.InvalidChangesetError) could not perform insert because changeset is invalid.

Errors

    %{
      external_id: [
        {"has already been taken",
         [constraint: :unique, constraint_name: "tenants_external_id_index"]}
      ]
    }

Applied changes

    %{
      name: "realtime-dev",
      suspend: false,
      extensions: [
        %{
          type: "postgres_cdc_rls",
          settings: %{
            "db_host" => "+BzllXu7Z1KmVFqhTpWkVLMrOdPJZ0Rk5n8tE5sdTMM=",
            "db_name" => "sWBpZNdjggEPTQVlI52Zfw==",
            "db_password" => "sWBpZNdjggEPTQVlI52Zfw==",
            "db_port" => "+enMDFi1J/3IrrquHHwUmA==",
            "db_user" => "uxbEq/zz8DXVD53TOI1zmw==",
            "poll_interval_ms" => 100,
            "poll_max_changes" => 100,
            "poll_max_record_bytes" => 1048576,
            "publication" => "supabase_realtime",
            "region" => "us-east-1",
            "slot_name" => "supabase_realtime_replication_slot",
            "ssl_enforced" => false
          }
        }
      ],
      external_id: "realtime-dev",
      max_concurrent_users: 200,
      jwt_secret: "[REDACTED]",
      jwt_jwks: %{
        "keys" => [
          %{
            "alg" => "ES256",
            "crv" => "P-256",
            "ext" => true,
            "key_ops" => ["verify"],
            "kid" => "b81269f1-21d8-4f2e-b719-c2240a840d90",
            "kty" => "EC",
            "use" => "sig",
            "x" => "M5Sjqn5zwC9Kl1zVfUUGvv9boQjCGd45G8sdopBExB4",
            "y" => "P6IXMvA2WYXSHSOMTBH2jsw_9rrzGy89FjPf6oOsIxQ"
          },
          %{
            "k" => "c3VwZXItc2VjcmV0LWp3dC10b2tlbi13aXRoLWF0LWxlYXN0LTMyLWNoYXJhY3RlcnMtbG9uZw",
            "kty" => "oct"
          }
        ]
      },
      migrations_ran: 0,
      broadcast_adapter: :gen_rpc,
      feature_flags: %{},
      max_bytes_per_second: 100000,
      max_channels_per_client: 100,
      max_events_per_second: 100,
      max_joins_per_second: 100,
      max_payload_size_in_kb: 3000,
      max_presence_events_per_second: 1000,
      presence_enabled: false,
      private_only: false
    }

Params

    %{
      "extensions" => [
        %{
          "settings" => %{
            "db_host" => "supabase_db_ds-shared-runtime",
            "db_name" => "postgres",
            "db_password" => "postgres",
            "db_port" => "5432",
            "db_user" => "supabase_admin",
            "poll_interval_ms" => 100,
            "poll_max_record_bytes" => 1048576,
            "region" => "us-east-1",
            "ssl_enforced" => false
          },
          "type" => "postgres_cdc_rls"
        }
      ],
      "external_id" => "realtime-dev",
      "jwt_jwks" => %{
        "keys" => [
          %{
            "alg" => "ES256",
            "crv" => "P-256",
            "ext" => true,
            "key_ops" => ["verify"],
            "kid" => "b81269f1-21d8-4f2e-b719-c2240a840d90",
            "kty" => "EC",
            "use" => "sig",
            "x" => "M5Sjqn5zwC9Kl1zVfUUGvv9boQjCGd45G8sdopBExB4",
            "y" => "P6IXMvA2WYXSHSOMTBH2jsw_9rrzGy89FjPf6oOsIxQ"
          },
          %{
            "k" => "c3VwZXItc2VjcmV0LWp3dC10b2tlbi13aXRoLWF0LWxlYXN0LTMyLWNoYXJhY3RlcnMtbG9uZw",
            "kty" => "oct"
          }
        ]
      },
      "jwt_secret" => "super-secret-jwt-token-with-at-least-32-characters-long",
      "name" => "realtime-dev"
    }

Changeset

    #Ecto.Changeset<
      action: :insert,
      changes: %{
        name: "realtime-dev",
        suspend: false,
        extensions: [
          #Ecto.Changeset<
            action: :insert,
            changes: %{
              type: "postgres_cdc_rls",
              settings: %{
                "db_host" => "+BzllXu7Z1KmVFqhTpWkVLMrOdPJZ0Rk5n8tE5sdTMM=",
                "db_name" => "sWBpZNdjggEPTQVlI52Zfw==",
                "db_password" => "sWBpZNdjggEPTQVlI52Zfw==",
                "db_port" => "+enMDFi1J/3IrrquHHwUmA==",
                "db_user" => "uxbEq/zz8DXVD53TOI1zmw==",
                "poll_interval_ms" => 100,
                "poll_max_changes" => 100,
                "poll_max_record_bytes" => 1048576,
                "publication" => "supabase_realtime",
                "region" => "us-east-1",
                "slot_name" => "supabase_realtime_replication_slot",
                "ssl_enforced" => false
              }
            },
            errors: [],
            data: #Realtime.Api.Extensions<>,
            valid?: true,
            ...
          >
        ],
        external_id: "realtime-dev",
        max_concurrent_users: 200,
        jwt_secret: "[REDACTED]",
        jwt_jwks: %{
          "keys" => [
            %{
              "alg" => "ES256",
              "crv" => "P-256",
              "ext" => true,
              "key_ops" => ["verify"],
              "kid" => "b81269f1-21d8-4f2e-b719-c2240a840d90",
              "kty" => "EC",
              "use" => "sig",
              "x" => "M5Sjqn5zwC9Kl1zVfUUGvv9boQjCGd45G8sdopBExB4",
              "y" => "P6IXMvA2WYXSHSOMTBH2jsw_9rrzGy89FjPf6oOsIxQ"
            },
            %{
              "k" => "c3VwZXItc2VjcmV0LWp3dC10b2tlbi13aXRoLWF0LWxlYXN0LTMyLWNoYXJhY3RlcnMtbG9uZw",
              "kty" => "oct"
            }
          ]
        },
        migrations_ran: 0,
        broadcast_adapter: :gen_rpc,
        feature_flags: %{},
        max_bytes_per_second: 100000,
        max_channels_per_client: 100,
        max_events_per_second: 100,
        max_joins_per_second: 100,
        max_payload_size_in_kb: 3000,
        max_presence_events_per_second: 1000,
        presence_enabled: false,
        private_only: false
      },
      errors: [
        external_id: {"has already been taken",
         [constraint: :unique, constraint_name: "tenants_external_id_index"]}
      ],
      data: #Realtime.Api.Tenant<>,
      valid?: false,
      ...
    >

    (ecto 3.13.6) lib/ecto/repo/schema.ex:386: Ecto.Repo.Schema.insert!/4
    /app/lib/realtime-2.128.0/priv/repo/seeds.exs:42: (file)
    /app/lib/realtime-2.128.0/priv/repo/seeds.exs:13: (file)
    (realtime 2.128.0) lib/realtime/repo.ex:2: anonymous fn/1 in Realtime.Repo.transaction/2
    (ecto 3.13.6) lib/ecto/repo/transaction.ex:11: anonymous fn/3 in Ecto.Repo.Transaction.transact/4
    (ecto_sql 3.13.2) lib/ecto/adapters/sql.ex:1458: anonymous fn/3 in Ecto.Adapters.SQL.checkout_or_transaction/4
[os_mon] memory supervisor port (memsup): Erlang has closed
[os_mon] cpu supervisor port (cpu_sup): Erlang has closed
error running container: exit 1
```


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name rename_ambiguity_baseline --debug`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
The baseline reset failed, so the initial declarative sync was skipped.
```


## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
The declarative baseline failed, so the rename ambiguity transition was skipped.
```
<!-- declarative-schema-command-result case="307-move-table" engine="next" command="sync" status="ERROR" -->

## Transition fallback (legacy)

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
- Duration: `0.8s`

### Clear local runtime before baseline (legacy)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `33.2s`

### Establish baseline (legacy)

- Command: `npx supabase db schema declarative sync --apply --name rename_ambiguity_baseline --debug`
- Result: **ERROR**
- Duration: `18.3s`
- Exit code: `1`

```text
NotFound: FileSystem.readFile (C:\Users\Arcure\.supabase\profile)
Using pg-delta legacy implementation.
Creating shadow database...
Creating shadow database...
Applying declarative schemas via pg-delta...
Applied 4 statements in 1 round(s).
Generated migration SQL:
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net;

CREATE TABLE public.catalogue_rename_source (
  id    bigint NOT NULL,
  label text
);

ALTER TABLE public.catalogue_rename_source
  ADD CONSTRAINT catalogue_rename_source_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_rename_source TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_rename_source TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_rename_source TO service_role;

CREATE TABLE public.transition_anchor (
  id      bigint NOT NULL,
  payload text   NOT NULL
);

ALTER TABLE public.transition_anchor
  ADD CONSTRAINT transition_anchor_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO service_role;
Created new migration at E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-DHzNgi\307-move-table-legacy\supabase\migrations\20260815183713_rename_ambiguity_baseline.sql
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

Debug information saved to E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-DHzNgi\307-move-table-legacy\supabase\.temp\pgdelta\debug\20260815-183713-apply-error

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
The declarative baseline failed, so the rename ambiguity transition was skipped.
```
<!-- declarative-schema-command-result case="307-move-table" engine="legacy" command="sync" status="ERROR" -->
