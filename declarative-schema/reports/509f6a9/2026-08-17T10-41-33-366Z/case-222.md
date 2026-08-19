# Case: 222-collation-conversion-create

## Baseline state A

```sql
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);
```

## Desired state B

```sql
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create collation public.transition_icu_222 (
  provider = icu,
  locale = 'und',
  deterministic = true
);
create conversion public.transition_utf8_latin1_222
  for 'UTF8' to 'LATIN1'
  from pg_catalog.utf8_to_iso8859_1;
```

## Representative data setup

```sql
insert into public.transition_anchor (case_no, payload)
values (222, 'case-222');
```

## CLI-generated baseline migration files

### `20260817194205_222_collation_conversion_create_baseline.sql`

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

- Raw sync result: **OK**
- Assertion: **ERROR**
- The generated migration did not satisfy its declared SQL-shape contract. Missing operation(s): create the encoding conversion.

## Generated transition migration files

### `20260817194245_declarative_sync.sql`

```sql
create collation "public"."transition_icu_222" (
  provider = icu,
  locale   = 'und'
);
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.7s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `20.9s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 222_collation_conversion_create_baseline --debug`
- Result: **OK**
- Duration: `41.7s`

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
- Result: **ERROR**
- Duration: `40.2s`
- Exit code: `0`

```text
The generated migration did not satisfy its declared SQL-shape contract. Missing operation(s): create the encoding conversion.
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
Applying migration 20260817194205_222_collation_conversion_create_baseline.sql...
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
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:auth.users.confirmed_at message=edge default:auth.users.confirmed_at -[depends]-> column:auth.users.email_confirmed_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey message=edge constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey -[depends]-> column:realtime.messages_2026_08_16.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_16.inserted_at message=edge default:realtime.messages_2026_08_16.inserted_at -[depends]-> column:realtime.messages_2026_08_16.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:vault.secrets.updated_at message=edge default:vault.secrets.updated_at -[depends]-> column:vault.secrets.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.updated_at message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey message=edge constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey -[depends]-> column:realtime.messages_2026_08_17.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_17.inserted_at message=edge default:realtime.messages_2026_08_17.inserted_at -[depends]-> column:realtime.messages_2026_08_17.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.key_id message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.key_id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_19_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_19_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_19.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_19.messages_2026_08_19_pkey message=edge constraint:realtime.messages_2026_08_19.messages_2026_08_19_pkey -[depends]-> column:realtime.messages_2026_08_19.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_19.inserted_at message=edge default:realtime.messages_2026_08_19.inserted_at -[depends]-> column:realtime.messages_2026_08_19.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_19.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_19.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_19.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_17.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_17.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:vault.secrets.created_at message=edge default:vault.secrets.created_at -[depends]-> column:vault.secrets.created_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.created_at message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.created_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey message=edge constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey -[depends]-> column:realtime.messages_2026_08_17.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_17.id message=edge default:realtime.messages_2026_08_17.id -[depends]-> column:realtime.messages_2026_08_17.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_18.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_18.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.subscription.claims_role message=edge default:realtime.subscription.claims_role -[depends]-> column:realtime.subscription.claims references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_20_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_20_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_20.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:auth.users.confirmed_at message=edge default:auth.users.confirmed_at -[depends]-> column:auth.users.phone_confirmed_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:vault.secrets_name_idx message=edge index:vault.secrets_name_idx -[depends]-> column:vault.secrets.name references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.name message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.name references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey message=edge constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey -[depends]-> column:realtime.messages_2026_08_18.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_18.inserted_at message=edge default:realtime.messages_2026_08_18.inserted_at -[depends]-> column:realtime.messages_2026_08_18.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_19_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_19_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_19.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_19.private message=edge default:realtime.messages_2026_08_19.private -[depends]-> column:realtime.messages_2026_08_19.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:vault.secrets.nonce message=edge default:vault.secrets.nonce -[depends]-> column:vault.secrets.nonce references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.nonce message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.nonce references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:vault.secrets.id message=edge default:vault.secrets.id -[depends]-> column:vault.secrets.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:vault.secrets.secrets_pkey message=edge constraint:vault.secrets.secrets_pkey -[depends]-> column:vault.secrets.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.id message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_16.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_16.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey message=edge constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey -[depends]-> column:realtime.messages_2026_08_16.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_16.id message=edge default:realtime.messages_2026_08_16.id -[depends]-> column:realtime.messages_2026_08_16.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_16.private message=edge default:realtime.messages_2026_08_16.private -[depends]-> column:realtime.messages_2026_08_16.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:auth.identities.email message=edge default:auth.identities.email -[depends]-> column:auth.identities.identity_data references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_20.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_20.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_20.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey message=edge constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey -[depends]-> column:realtime.messages_2026_08_18.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_18.id message=edge default:realtime.messages_2026_08_18.id -[depends]-> column:realtime.messages_2026_08_18.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_18.updated_at message=edge default:realtime.messages_2026_08_18.updated_at -[depends]-> column:realtime.messages_2026_08_18.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_20_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_20_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_20.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_20.private message=edge default:realtime.messages_2026_08_20.private -[depends]-> column:realtime.messages_2026_08_20.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_19.updated_at message=edge default:realtime.messages_2026_08_19.updated_at -[depends]-> column:realtime.messages_2026_08_19.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_19.messages_2026_08_19_pkey message=edge constraint:realtime.messages_2026_08_19.messages_2026_08_19_pkey -[depends]-> column:realtime.messages_2026_08_19.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_19.id message=edge default:realtime.messages_2026_08_19.id -[depends]-> column:realtime.messages_2026_08_19.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:vault.secrets.nonce message=edge default:vault.secrets.nonce -[depends]-> extension:supabase_vault references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.nonce message=edge column:vault.secrets.nonce -[depends]-> extension:supabase_vault references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_17.private message=edge default:realtime.messages_2026_08_17.private -[depends]-> column:realtime.messages_2026_08_17.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_20.messages_2026_08_20_pkey message=edge constraint:realtime.messages_2026_08_20.messages_2026_08_20_pkey -[depends]-> column:realtime.messages_2026_08_20.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_20.id message=edge default:realtime.messages_2026_08_20.id -[depends]-> column:realtime.messages_2026_08_20.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_18.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_18.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.secret message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.secret references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_17.updated_at message=edge default:realtime.messages_2026_08_17.updated_at -[depends]-> column:realtime.messages_2026_08_17.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_19_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_19_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_19.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:storage.objects.path_tokens message=edge default:storage.objects.path_tokens -[depends]-> column:storage.objects.name references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_16.updated_at message=edge default:realtime.messages_2026_08_16.updated_at -[depends]-> column:realtime.messages_2026_08_16.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_18.private message=edge default:realtime.messages_2026_08_18.private -[depends]-> column:realtime.messages_2026_08_18.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_20.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_20.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_20.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.subscription.claims_role message=edge default:realtime.subscription.claims_role -[depends]-> function:realtime.to_regrole(text) references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_19.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_19.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_19.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_17.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_17.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:vault.secrets.description message=edge default:vault.secrets.description -[depends]-> column:vault.secrets.description references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.description message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.description references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=sequence:realtime.subscription_id_seq message=edge sequence:realtime.subscription_id_seq -[depends]-> schema:realtime references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_19_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_19_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_19.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_20.updated_at message=edge default:realtime.messages_2026_08_20.updated_at -[depends]-> column:realtime.messages_2026_08_20.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_20_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_20_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_20.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_16.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_16.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_20_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_20_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_20.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_20.messages_2026_08_20_pkey message=edge constraint:realtime.messages_2026_08_20.messages_2026_08_20_pkey -[depends]-> column:realtime.messages_2026_08_20.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_20.inserted_at message=edge default:realtime.messages_2026_08_20.inserted_at -[depends]-> column:realtime.messages_2026_08_20.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=pgbouncer.get_auth: permission denied for schema pgbouncer
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=auth.uid: permission denied for schema auth
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=auth.role: permission denied for schema auth
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=auth.email: permission denied for schema auth
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.apply_rls: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.broadcast_changes: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.cast: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=extensions.pgrst_drop_watch: must be owner of function pgrst_drop_watch
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.quote_wal2json: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.wal2json_escape_identifier: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=extensions.pgrst_ddl_watch: must be owner of function pgrst_ddl_watch
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=extensions.grant_pg_cron_access: must be owner of function grant_pg_cron_access
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=extensions.set_graphql_placeholder: must be owner of function set_graphql_placeholder
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=extensions.grant_pg_graphql_access: must be owner of function grant_pg_graphql_access
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=graphql_public.graphql: permission denied for schema graphql_public
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=extensions.grant_pg_net_access: must be owner of function grant_pg_net_access
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.build_prepared_statement_sql: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.check_equality_op: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.check_equality_op: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.is_visible_through_filters: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.list_changes: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.foldername: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.get_size_by_bucket: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.extension: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.filename: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.send: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.send_binary: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.subscription_check_filters: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.to_regrole: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=realtime.topic: permission denied for schema realtime
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.update_updated_at_column: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.can_insert_object: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.list_multipart_uploads_with_delimiter: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.operation: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.enforce_bucket_name_length: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.get_common_prefix: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.list_objects_with_delimiter: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.search_v2: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.search_by_timestamp: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.protect_delete: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.search: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.allow_only_operation: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=storage.allow_any_operation: permission denied for schema storage
pg-delta next diagnostic: origin=declarativeLoad code=invalid_routine_body message=auth.jwt: permission denied for schema auth
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:auth.users.confirmed_at message=edge default:auth.users.confirmed_at -[depends]-> column:auth.users.email_confirmed_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey message=edge constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey -[depends]-> column:realtime.messages_2026_08_16.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_16.inserted_at message=edge default:realtime.messages_2026_08_16.inserted_at -[depends]-> column:realtime.messages_2026_08_16.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:vault.secrets.updated_at message=edge default:vault.secrets.updated_at -[depends]-> column:vault.secrets.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=column:vault.secrets.updated_at message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey message=edge constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey -[depends]-> column:realtime.messages_2026_08_17.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_17.inserted_at message=edge default:realtime.messages_2026_08_17.inserted_at -[depends]-> column:realtime.messages_2026_08_17.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=column:vault.secrets.key_id message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.key_id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_19_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_19_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_19.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_19.messages_2026_08_19_pkey message=edge constraint:realtime.messages_2026_08_19.messages_2026_08_19_pkey -[depends]-> column:realtime.messages_2026_08_19.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_19.inserted_at message=edge default:realtime.messages_2026_08_19.inserted_at -[depends]-> column:realtime.messages_2026_08_19.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_19.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_19.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_19.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_17.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_17.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:vault.secrets.created_at message=edge default:vault.secrets.created_at -[depends]-> column:vault.secrets.created_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=column:vault.secrets.created_at message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.created_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey message=edge constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey -[depends]-> column:realtime.messages_2026_08_17.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_17.id message=edge default:realtime.messages_2026_08_17.id -[depends]-> column:realtime.messages_2026_08_17.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_18.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_18.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.subscription.claims_role message=edge default:realtime.subscription.claims_role -[depends]-> column:realtime.subscription.claims references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_20_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_20_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_20.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:auth.users.confirmed_at message=edge default:auth.users.confirmed_at -[depends]-> column:auth.users.phone_confirmed_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:vault.secrets_name_idx message=edge index:vault.secrets_name_idx -[depends]-> column:vault.secrets.name references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=column:vault.secrets.name message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.name references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey message=edge constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey -[depends]-> column:realtime.messages_2026_08_18.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_18.inserted_at message=edge default:realtime.messages_2026_08_18.inserted_at -[depends]-> column:realtime.messages_2026_08_18.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_19_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_19_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_19.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_19.private message=edge default:realtime.messages_2026_08_19.private -[depends]-> column:realtime.messages_2026_08_19.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:vault.secrets.nonce message=edge default:vault.secrets.nonce -[depends]-> column:vault.secrets.nonce references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=column:vault.secrets.nonce message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.nonce references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:vault.secrets.id message=edge default:vault.secrets.id -[depends]-> column:vault.secrets.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:vault.secrets.secrets_pkey message=edge constraint:vault.secrets.secrets_pkey -[depends]-> column:vault.secrets.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=column:vault.secrets.id message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_16.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_16.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey message=edge constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey -[depends]-> column:realtime.messages_2026_08_16.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_16.id message=edge default:realtime.messages_2026_08_16.id -[depends]-> column:realtime.messages_2026_08_16.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_16.private message=edge default:realtime.messages_2026_08_16.private -[depends]-> column:realtime.messages_2026_08_16.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:auth.identities.email message=edge default:auth.identities.email -[depends]-> column:auth.identities.identity_data references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_20.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_20.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_20.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey message=edge constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey -[depends]-> column:realtime.messages_2026_08_18.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_18.id message=edge default:realtime.messages_2026_08_18.id -[depends]-> column:realtime.messages_2026_08_18.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_18.updated_at message=edge default:realtime.messages_2026_08_18.updated_at -[depends]-> column:realtime.messages_2026_08_18.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_20_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_20_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_20.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_20.private message=edge default:realtime.messages_2026_08_20.private -[depends]-> column:realtime.messages_2026_08_20.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_19.updated_at message=edge default:realtime.messages_2026_08_19.updated_at -[depends]-> column:realtime.messages_2026_08_19.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_19.messages_2026_08_19_pkey message=edge constraint:realtime.messages_2026_08_19.messages_2026_08_19_pkey -[depends]-> column:realtime.messages_2026_08_19.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_19.id message=edge default:realtime.messages_2026_08_19.id -[depends]-> column:realtime.messages_2026_08_19.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:vault.secrets.nonce message=edge default:vault.secrets.nonce -[depends]-> extension:supabase_vault references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=column:vault.secrets.nonce message=edge column:vault.secrets.nonce -[depends]-> extension:supabase_vault references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_17.private message=edge default:realtime.messages_2026_08_17.private -[depends]-> column:realtime.messages_2026_08_17.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_20.messages_2026_08_20_pkey message=edge constraint:realtime.messages_2026_08_20.messages_2026_08_20_pkey -[depends]-> column:realtime.messages_2026_08_20.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_20.id message=edge default:realtime.messages_2026_08_20.id -[depends]-> column:realtime.messages_2026_08_20.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_18.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_18.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=column:vault.secrets.secret message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.secret references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_17.updated_at message=edge default:realtime.messages_2026_08_17.updated_at -[depends]-> column:realtime.messages_2026_08_17.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_19_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_19_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_19.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:storage.objects.path_tokens message=edge default:storage.objects.path_tokens -[depends]-> column:storage.objects.name references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_16.updated_at message=edge default:realtime.messages_2026_08_16.updated_at -[depends]-> column:realtime.messages_2026_08_16.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_18.private message=edge default:realtime.messages_2026_08_18.private -[depends]-> column:realtime.messages_2026_08_18.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_20.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_20.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_20.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.subscription.claims_role message=edge default:realtime.subscription.claims_role -[depends]-> function:realtime.to_regrole(text) references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_19.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_19.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_19.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_17.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_17.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:vault.secrets.description message=edge default:vault.secrets.description -[depends]-> column:vault.secrets.description references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=column:vault.secrets.description message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.description references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=sequence:realtime.subscription_id_seq message=edge sequence:realtime.subscription_id_seq -[depends]-> schema:realtime references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_19_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_19_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_19.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_20.updated_at message=edge default:realtime.messages_2026_08_20.updated_at -[depends]-> column:realtime.messages_2026_08_20.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_20_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_20_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_20.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_16.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_16.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_20_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_20_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_20.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_20.messages_2026_08_20_pkey message=edge constraint:realtime.messages_2026_08_20.messages_2026_08_20_pkey -[depends]-> column:realtime.messages_2026_08_20.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_20.inserted_at message=edge default:realtime.messages_2026_08_20.inserted_at -[depends]-> column:realtime.messages_2026_08_20.inserted_at references a fact not in the base
Generated migration SQL:
create collation "public"."transition_icu_222" (
  provider = icu,
  locale   = 'und'
);

Created new migration at E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\222-collation-conversion-create\supabase\migrations\20260817194245_declarative_sync.sql
A new version of Supabase CLI is available: v2.114.0 (currently installed v0.0.0-pr.6102)
We recommend updating regularly for new features and bug fixes: https://supabase.com/docs/guides/cli/getting-started#updating-the-supabase-cli
Generated migration SQL:
create collation "public"."transition_icu_222" (
  provider = icu,
  locale   = 'und'
);
```
<!-- declarative-schema-command-result case="222-collation-conversion-create" engine="next" command="sync" status="ERROR" -->

## Apply generated transition migration

- Command: `npx supabase migration up --local --debug`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
The generated migration failed its safety assertion, so it was not applied.
```

## Verify desired state B

- Command: `docker exec ... psql --file -`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
The transition migration was not applied, so desired state B was not verified.
```

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Desired state B verification failed, so convergence was not checked.
```
<!-- declarative-schema-command-result case="222-collation-conversion-create" engine="next" command="sync-verification" status="ERROR" -->

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
- Duration: `0.7s`

### Clear local runtime before baseline (legacy)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `22.2s`

### Establish baseline (legacy)

- Command: `npx supabase db schema declarative sync --apply --name 222_collation_conversion_create_baseline --debug`
- Result: **ERROR**
- Duration: `62.8s`
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
Applied 3 statements in 1 round(s).
Generated migration SQL:
-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net;

CREATE TABLE public.transition_anchor (
  case_no integer NOT NULL,
  payload text    NOT NULL
);

ALTER TABLE public.transition_anchor
  ADD CONSTRAINT transition_anchor_pkey PRIMARY KEY (case_no);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.transition_anchor TO service_role;
Created new migration at E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\222-collation-conversion-create-legacy\supabase\migrations\20260817194411_222_collation_conversion_create_baseline.sql
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

Debug information saved to E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-bCM1EI\222-collation-conversion-create-legacy\supabase\.temp\pgdelta\debug\20260817-194411-apply-error

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
The declarative baseline failed, so the create an ICU collation and encoding conversion together transition was skipped.
```
<!-- declarative-schema-command-result case="222-collation-conversion-create" engine="legacy" command="sync" status="ERROR" -->

