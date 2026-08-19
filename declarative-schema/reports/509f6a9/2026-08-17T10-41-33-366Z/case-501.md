# Case: 501-matview-concurrent-refresh

- Scenario pack: `Views and materialized views catalogue scenarios` / `matview-concurrent-refresh`
- Catalogue atoms: `PG-CAT-VIW-04::matview.concurrent-refresh`

## Baseline state A

```sql
-- Covers PG-CAT-VIW-04::matview.concurrent-refresh. Keep public.transition_anchor identity stable. This atom is an explicit supported/unsupported boundary, not an accidental omission.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_probe (
  id bigint primary key, label text
);
```

## Desired state B

```sql
-- Covers PG-CAT-VIW-04::matview.concurrent-refresh. Keep public.transition_anchor identity stable. This atom is an explicit supported/unsupported boundary, not an accidental omission.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_probe (
  id bigint primary key, label text
);
-- Desired change for matview.concurrent-refresh must be refused, not silently omitted.
```

## Representative data setup

```sql
insert into public.transition_anchor values (1, 'preserved');
```

## CLI-generated baseline migration files

_(no files generated)_

## Expected-unsupported diagnostic assertion

- Raw sync result: **SKIPPED**
- Assertion: **SKIPPED**
- The safety assertion did not run.

## Generated transition migration files

_(no files generated)_

## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **ERROR**
- Duration: `16.7s`
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
    /app/lib/realtime-2.128.2/priv/repo/seeds.exs:42: (file)
    /app/lib/realtime-2.128.2/priv/repo/seeds.exs:13: (file)
    (realtime 2.128.2) lib/realtime/repo.ex:2: anonymous fn/1 in Realtime.Repo.transaction/2
    (ecto 3.13.6) lib/ecto/repo/transaction.ex:11: anonymous fn/3 in Ecto.Repo.Transaction.transact/4
    (ecto_sql 3.13.2) lib/ecto/adapters/sql.ex:1458: anonymous fn/3 in Ecto.Adapters.SQL.checkout_or_transaction/4
[os_mon] memory supervisor port (memsup): Erlang has closed
[os_mon] cpu supervisor port (cpu_sup): Erlang has closed
error running container: exit 1
```


## Establish baseline with declarative sync --apply

- Command: `docker exec ... psql --file -`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
The baseline reset failed, so direct bootstrap was skipped.
```


## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Baseline bootstrap failed, so unsupported-capability planning was skipped.
```
<!-- declarative-schema-command-result case="501-matview-concurrent-refresh" engine="next" command="sync" status="ERROR" -->

### Transition fallback (legacy)

- Overall result: **FAILED**
- Raw sync result: **OK**
- Assertion: **ERROR**
- The unsupported capability did not satisfy its diagnostic contract. Raw sync unexpectedly completed with status OK; promote this fixture to applicable-transition if support is intentional. Missing diagnostic(s): reports a stable capability or scope diagnostic.

### Legacy-generated baseline migration files

_(no files generated)_

### Legacy-generated transition migration files

### `20260818144313_declarative_sync.sql`

```sql
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net;

CREATE TABLE public.catalogue_probe (
  id    bigint NOT NULL,
  label text
);

ALTER TABLE public.catalogue_probe
  ADD CONSTRAINT catalogue_probe_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_probe TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_probe TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_probe TO service_role;

CREATE TABLE public.transition_anchor (
  id      bigint NOT NULL,
  payload text   NOT NULL
);

ALTER TABLE public.transition_anchor
  ADD CONSTRAINT transition_anchor_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO service_role;
```


### Start local runtime (legacy)

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.8s`

### Clear local runtime before baseline (legacy)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `34.9s`

### Establish baseline (legacy)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

### Insert representative data (legacy)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

### Capture baseline state (legacy)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

### Sync (legacy)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **ERROR**
- Duration: `53.8s`
- Exit code: `0`

```text
The unsupported capability did not satisfy its diagnostic contract. Raw sync unexpectedly completed with status OK; promote this fixture to applicable-transition if support is intentional. Missing diagnostic(s): reports a stable capability or scope diagnostic.
Raw sync status: OK
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

CREATE TABLE public.catalogue_probe (
  id    bigint NOT NULL,
  label text
);

ALTER TABLE public.catalogue_probe
  ADD CONSTRAINT catalogue_probe_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_probe TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_probe TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_probe TO service_role;

CREATE TABLE public.transition_anchor (
  id      bigint NOT NULL,
  payload text   NOT NULL
);

ALTER TABLE public.transition_anchor
  ADD CONSTRAINT transition_anchor_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO service_role;
Created new migration at E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\501-matview-concurrent-refresh-legacy\supabase\migrations\20260818144313_declarative_sync.sql
Found drop statements in schema diff. Please double check if these are expected:
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net
A new version of Supabase CLI is available: v2.115.0 (currently installed v0.0.0-pr.6102)
We recommend updating regularly for new features and bug fixes: https://supabase.com/docs/guides/cli/getting-started#updating-the-supabase-cli
Generated migration SQL:
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net;

CREATE TABLE public.catalogue_probe (
  id    bigint NOT NULL,
  label text
);

ALTER TABLE public.catalogue_probe
  ADD CONSTRAINT catalogue_probe_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_probe TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_probe TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.catalogue_probe TO service_role;

CREATE TABLE public.transition_anchor (
  id      bigint NOT NULL,
  payload text   NOT NULL
);

ALTER TABLE public.transition_anchor
  ADD CONSTRAINT transition_anchor_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO service_role;
```
<!-- declarative-schema-command-result case="501-matview-concurrent-refresh" engine="legacy" command="sync" status="ERROR" -->

### Sync verification / convergence (legacy)

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`
<!-- declarative-schema-command-result case="501-matview-concurrent-refresh" engine="legacy" command="sync-verification" status="OK" -->

