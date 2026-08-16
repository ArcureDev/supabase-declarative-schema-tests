# Case: 315-boundary-temporary

- Scenario pack: `Schemas, tables, columns, and sequences catalogue scenarios` / `boundary-temporary`
- Catalogue atoms: `PG-CAT-STC-02::boundary.temporary`

## Baseline state A

```sql
-- Covers PG-CAT-STC-02::boundary.temporary. Keep public.transition_anchor identity stable. This atom is an explicit supported/unsupported boundary, not an accidental omission.
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
-- Covers PG-CAT-STC-02::boundary.temporary. Keep public.transition_anchor identity stable. This atom is an explicit supported/unsupported boundary, not an accidental omission.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_probe (
  id bigint primary key, label text
);
-- Desired change for boundary.temporary must be refused, not silently omitted.
```

## Representative data setup

```sql
insert into public.transition_anchor values (1, 'preserved');
```

## CLI-generated baseline migration files

_(no files generated)_

## Expected-unsupported diagnostic assertion

- Raw sync result: **OK**
- Assertion: **ERROR**
- The unsupported capability did not satisfy its diagnostic contract. Raw sync unexpectedly completed with status OK; promote this fixture to applicable-transition if support is intentional. Missing diagnostic(s): reports a stable capability or scope diagnostic.

## Generated transition migration files

### `20260815184650_declarative_sync.sql`

```sql
create table "public"."catalogue_probe" (
  "id"    bigint not null,
  "label" text,
  constraint "catalogue_probe_pkey" primary key (id)
);

create table "public"."transition_anchor" (
  "id"      bigint not null,
  "payload" text   not null,
  constraint "transition_anchor_pkey" primary key (id)
);

grant maintain, references, trigger, truncate on table "public"."catalogue_probe" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."catalogue_probe" to "postgres";

grant maintain, references, trigger, truncate on table "public"."catalogue_probe" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `31.6s`


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
- Result: **ERROR**
- Duration: `13.9s`
- Exit code: `0`

```text
The unsupported capability did not satisfy its diagnostic contract. Raw sync unexpectedly completed with status OK; promote this fixture to applicable-transition if support is intentional. Missing diagnostic(s): reports a stable capability or scope diagnostic.
Raw sync status: OK
NotFound: FileSystem.readFile (C:\Users\Arcure\.supabase\profile)
Using pg-delta next implementation.
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:auth.users.confirmed_at message=edge default:auth.users.confirmed_at -[depends]-> column:auth.users.email_confirmed_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_14_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_14_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_14.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_14.messages_2026_08_14_pkey message=edge constraint:realtime.messages_2026_08_14.messages_2026_08_14_pkey -[depends]-> column:realtime.messages_2026_08_14.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_14.inserted_at message=edge default:realtime.messages_2026_08_14.inserted_at -[depends]-> column:realtime.messages_2026_08_14.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:vault.secrets.updated_at message=edge default:vault.secrets.updated_at -[depends]-> column:vault.secrets.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.updated_at message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_15_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_15_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_15.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_15_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_15_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_15.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_15.messages_2026_08_15_pkey message=edge constraint:realtime.messages_2026_08_15.messages_2026_08_15_pkey -[depends]-> column:realtime.messages_2026_08_15.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_15.inserted_at message=edge default:realtime.messages_2026_08_15.inserted_at -[depends]-> column:realtime.messages_2026_08_15.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.key_id message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.key_id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey message=edge constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey -[depends]-> column:realtime.messages_2026_08_17.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_17.inserted_at message=edge default:realtime.messages_2026_08_17.inserted_at -[depends]-> column:realtime.messages_2026_08_17.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_17.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_17.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_15.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_15.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_15.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:vault.secrets.created_at message=edge default:vault.secrets.created_at -[depends]-> column:vault.secrets.created_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.created_at message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.created_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_15.messages_2026_08_15_pkey message=edge constraint:realtime.messages_2026_08_15.messages_2026_08_15_pkey -[depends]-> column:realtime.messages_2026_08_15.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_15.id message=edge default:realtime.messages_2026_08_15.id -[depends]-> column:realtime.messages_2026_08_15.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_16.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_16.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.subscription.claims_role message=edge default:realtime.subscription.claims_role -[depends]-> column:realtime.subscription.claims references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:auth.users.confirmed_at message=edge default:auth.users.confirmed_at -[depends]-> column:auth.users.phone_confirmed_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:vault.secrets_name_idx message=edge index:vault.secrets_name_idx -[depends]-> column:vault.secrets.name references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.name message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.name references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey message=edge constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey -[depends]-> column:realtime.messages_2026_08_16.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_16.inserted_at message=edge default:realtime.messages_2026_08_16.inserted_at -[depends]-> column:realtime.messages_2026_08_16.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_17.private message=edge default:realtime.messages_2026_08_17.private -[depends]-> column:realtime.messages_2026_08_17.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:vault.secrets.nonce message=edge default:vault.secrets.nonce -[depends]-> column:vault.secrets.nonce references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.nonce message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.nonce references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:vault.secrets.id message=edge default:vault.secrets.id -[depends]-> column:vault.secrets.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:vault.secrets.secrets_pkey message=edge constraint:vault.secrets.secrets_pkey -[depends]-> column:vault.secrets.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.id message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_14.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_14.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_14.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_14.messages_2026_08_14_pkey message=edge constraint:realtime.messages_2026_08_14.messages_2026_08_14_pkey -[depends]-> column:realtime.messages_2026_08_14.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_14.id message=edge default:realtime.messages_2026_08_14.id -[depends]-> column:realtime.messages_2026_08_14.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_14_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_14_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_14.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_14.private message=edge default:realtime.messages_2026_08_14.private -[depends]-> column:realtime.messages_2026_08_14.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:auth.identities.email message=edge default:auth.identities.email -[depends]-> column:auth.identities.identity_data references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_18.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_18.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_14_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_14_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_14.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey message=edge constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey -[depends]-> column:realtime.messages_2026_08_16.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_16.id message=edge default:realtime.messages_2026_08_16.id -[depends]-> column:realtime.messages_2026_08_16.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_16.updated_at message=edge default:realtime.messages_2026_08_16.updated_at -[depends]-> column:realtime.messages_2026_08_16.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_18.private message=edge default:realtime.messages_2026_08_18.private -[depends]-> column:realtime.messages_2026_08_18.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_17.updated_at message=edge default:realtime.messages_2026_08_17.updated_at -[depends]-> column:realtime.messages_2026_08_17.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey message=edge constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey -[depends]-> column:realtime.messages_2026_08_17.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_17.id message=edge default:realtime.messages_2026_08_17.id -[depends]-> column:realtime.messages_2026_08_17.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:vault.secrets.nonce message=edge default:vault.secrets.nonce -[depends]-> extension:supabase_vault references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.nonce message=edge column:vault.secrets.nonce -[depends]-> extension:supabase_vault references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_15_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_15_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_15.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_15.private message=edge default:realtime.messages_2026_08_15.private -[depends]-> column:realtime.messages_2026_08_15.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey message=edge constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey -[depends]-> column:realtime.messages_2026_08_18.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_18.id message=edge default:realtime.messages_2026_08_18.id -[depends]-> column:realtime.messages_2026_08_18.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_16.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_16.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.secret message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.secret references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_15.updated_at message=edge default:realtime.messages_2026_08_15.updated_at -[depends]-> column:realtime.messages_2026_08_15.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_14_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_14_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_14.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:storage.objects.path_tokens message=edge default:storage.objects.path_tokens -[depends]-> column:storage.objects.name references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_14.updated_at message=edge default:realtime.messages_2026_08_14.updated_at -[depends]-> column:realtime.messages_2026_08_14.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_16.private message=edge default:realtime.messages_2026_08_16.private -[depends]-> column:realtime.messages_2026_08_16.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_18.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_18.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.subscription.claims_role message=edge default:realtime.subscription.claims_role -[depends]-> function:realtime.to_regrole(text) references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_17.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_17.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_15.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_15.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_15.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_15_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_15_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_15.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:vault.secrets.description message=edge default:vault.secrets.description -[depends]-> column:vault.secrets.description references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=column:vault.secrets.description message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.description references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=sequence:realtime.subscription_id_seq message=edge sequence:realtime.subscription_id_seq -[depends]-> schema:realtime references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_18.updated_at message=edge default:realtime.messages_2026_08_18.updated_at -[depends]-> column:realtime.messages_2026_08_18.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_14.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_14.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_14.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey message=edge constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey -[depends]-> column:realtime.messages_2026_08_18.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeLoad code=dangling_edge subject=default:realtime.messages_2026_08_18.inserted_at message=edge default:realtime.messages_2026_08_18.inserted_at -[depends]-> column:realtime.messages_2026_08_18.inserted_at references a fact not in the base
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
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_14_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_14_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_14.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_14.messages_2026_08_14_pkey message=edge constraint:realtime.messages_2026_08_14.messages_2026_08_14_pkey -[depends]-> column:realtime.messages_2026_08_14.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_14.inserted_at message=edge default:realtime.messages_2026_08_14.inserted_at -[depends]-> column:realtime.messages_2026_08_14.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:vault.secrets.updated_at message=edge default:vault.secrets.updated_at -[depends]-> column:vault.secrets.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=column:vault.secrets.updated_at message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_15_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_15_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_15.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_15_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_15_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_15.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_15.messages_2026_08_15_pkey message=edge constraint:realtime.messages_2026_08_15.messages_2026_08_15_pkey -[depends]-> column:realtime.messages_2026_08_15.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_15.inserted_at message=edge default:realtime.messages_2026_08_15.inserted_at -[depends]-> column:realtime.messages_2026_08_15.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=column:vault.secrets.key_id message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.key_id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey message=edge constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey -[depends]-> column:realtime.messages_2026_08_17.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_17.inserted_at message=edge default:realtime.messages_2026_08_17.inserted_at -[depends]-> column:realtime.messages_2026_08_17.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_17.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_17.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_15.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_15.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_15.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:vault.secrets.created_at message=edge default:vault.secrets.created_at -[depends]-> column:vault.secrets.created_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=column:vault.secrets.created_at message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.created_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_15.messages_2026_08_15_pkey message=edge constraint:realtime.messages_2026_08_15.messages_2026_08_15_pkey -[depends]-> column:realtime.messages_2026_08_15.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_15.id message=edge default:realtime.messages_2026_08_15.id -[depends]-> column:realtime.messages_2026_08_15.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_16.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_16.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.subscription.claims_role message=edge default:realtime.subscription.claims_role -[depends]-> column:realtime.subscription.claims references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:auth.users.confirmed_at message=edge default:auth.users.confirmed_at -[depends]-> column:auth.users.phone_confirmed_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:vault.secrets_name_idx message=edge index:vault.secrets_name_idx -[depends]-> column:vault.secrets.name references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=column:vault.secrets.name message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.name references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey message=edge constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey -[depends]-> column:realtime.messages_2026_08_16.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_16.inserted_at message=edge default:realtime.messages_2026_08_16.inserted_at -[depends]-> column:realtime.messages_2026_08_16.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_17.private message=edge default:realtime.messages_2026_08_17.private -[depends]-> column:realtime.messages_2026_08_17.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:vault.secrets.nonce message=edge default:vault.secrets.nonce -[depends]-> column:vault.secrets.nonce references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=column:vault.secrets.nonce message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.nonce references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:vault.secrets.id message=edge default:vault.secrets.id -[depends]-> column:vault.secrets.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:vault.secrets.secrets_pkey message=edge constraint:vault.secrets.secrets_pkey -[depends]-> column:vault.secrets.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=column:vault.secrets.id message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_14.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_14.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_14.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_14.messages_2026_08_14_pkey message=edge constraint:realtime.messages_2026_08_14.messages_2026_08_14_pkey -[depends]-> column:realtime.messages_2026_08_14.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_14.id message=edge default:realtime.messages_2026_08_14.id -[depends]-> column:realtime.messages_2026_08_14.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_14_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_14_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_14.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_14.private message=edge default:realtime.messages_2026_08_14.private -[depends]-> column:realtime.messages_2026_08_14.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:auth.identities.email message=edge default:auth.identities.email -[depends]-> column:auth.identities.identity_data references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_18.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_18.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_14_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_14_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_14.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey message=edge constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey -[depends]-> column:realtime.messages_2026_08_16.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_16.id message=edge default:realtime.messages_2026_08_16.id -[depends]-> column:realtime.messages_2026_08_16.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_16.updated_at message=edge default:realtime.messages_2026_08_16.updated_at -[depends]-> column:realtime.messages_2026_08_16.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_18.private message=edge default:realtime.messages_2026_08_18.private -[depends]-> column:realtime.messages_2026_08_18.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_17.updated_at message=edge default:realtime.messages_2026_08_17.updated_at -[depends]-> column:realtime.messages_2026_08_17.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey message=edge constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey -[depends]-> column:realtime.messages_2026_08_17.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_17.id message=edge default:realtime.messages_2026_08_17.id -[depends]-> column:realtime.messages_2026_08_17.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:vault.secrets.nonce message=edge default:vault.secrets.nonce -[depends]-> extension:supabase_vault references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=column:vault.secrets.nonce message=edge column:vault.secrets.nonce -[depends]-> extension:supabase_vault references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_15_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_15_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_15.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_15.private message=edge default:realtime.messages_2026_08_15.private -[depends]-> column:realtime.messages_2026_08_15.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey message=edge constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey -[depends]-> column:realtime.messages_2026_08_18.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_18.id message=edge default:realtime.messages_2026_08_18.id -[depends]-> column:realtime.messages_2026_08_18.id references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_16.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_16.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=column:vault.secrets.secret message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.secret references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_15.updated_at message=edge default:realtime.messages_2026_08_15.updated_at -[depends]-> column:realtime.messages_2026_08_15.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_14_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_14_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_14.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:storage.objects.path_tokens message=edge default:storage.objects.path_tokens -[depends]-> column:storage.objects.name references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_14.updated_at message=edge default:realtime.messages_2026_08_14.updated_at -[depends]-> column:realtime.messages_2026_08_14.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_16.private message=edge default:realtime.messages_2026_08_16.private -[depends]-> column:realtime.messages_2026_08_16.private references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_18.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_18.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.subscription.claims_role message=edge default:realtime.subscription.claims_role -[depends]-> function:realtime.to_regrole(text) references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_17.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_17.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_15.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_15.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_15.payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_15_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_15_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_15.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:vault.secrets.description message=edge default:vault.secrets.description -[depends]-> column:vault.secrets.description references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=column:vault.secrets.description message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.description references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=sequence:realtime.subscription_id_seq message=edge sequence:realtime.subscription_id_seq -[depends]-> schema:realtime references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.extension references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_18.updated_at message=edge default:realtime.messages_2026_08_18.updated_at -[depends]-> column:realtime.messages_2026_08_18.updated_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.topic references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_14.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_14.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_14.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey message=edge constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey -[depends]-> column:realtime.messages_2026_08_18.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=declarativeTarget code=dangling_edge subject=default:realtime.messages_2026_08_18.inserted_at message=edge default:realtime.messages_2026_08_18.inserted_at -[depends]-> column:realtime.messages_2026_08_18.inserted_at references a fact not in the base
Generated migration SQL:
create table "public"."catalogue_probe" (
  "id"    bigint not null,
  "label" text,
  constraint "catalogue_probe_pkey" primary key (id)
);

create table "public"."transition_anchor" (
  "id"      bigint not null,
  "payload" text   not null,
  constraint "transition_anchor_pkey" primary key (id)
);

grant maintain, references, trigger, truncate on table "public"."catalogue_probe" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."catalogue_probe" to "postgres";

grant maintain, references, trigger, truncate on table "public"."catalogue_probe" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";

Created new migration at E:\workspace\supabase-declarative-schema-tests\declarative-schema\.tmp\run-DHzNgi\315-boundary-temporary\supabase\migrations\20260815184650_declarative_sync.sql
A new version of Supabase CLI is available: v2.114.0 (currently installed v0.0.0-pr.6203)
We recommend updating regularly for new features and bug fixes: https://supabase.com/docs/guides/cli/getting-started#updating-the-supabase-cli
Generated migration SQL:
create table "public"."catalogue_probe" (
  "id"    bigint not null,
  "label" text,
  constraint "catalogue_probe_pkey" primary key (id)
);

create table "public"."transition_anchor" (
  "id"      bigint not null,
  "payload" text   not null,
  constraint "transition_anchor_pkey" primary key (id)
);

grant maintain, references, trigger, truncate on table "public"."catalogue_probe" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."catalogue_probe" to "postgres";

grant maintain, references, trigger, truncate on table "public"."catalogue_probe" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```
<!-- declarative-schema-command-result case="315-boundary-temporary" engine="next" command="sync" status="ERROR" -->

## Verify unchanged state after unsupported planning

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`
<!-- declarative-schema-command-result case="315-boundary-temporary" engine="next" command="sync-verification" status="OK" -->

## Transition fallback (legacy)

- Overall result: **FAILED**
- Raw sync result: **SKIPPED**
- Assertion: **SKIPPED**
- The safety assertion did not run.

### Legacy-generated baseline migration files

_(no files generated)_

### Legacy-generated transition migration files

_(no files generated)_

### Start local runtime (legacy)

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `1.0s`

### Clear local runtime before baseline (legacy)

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **ERROR**
- Duration: `15.7s`
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

### Establish baseline (legacy)

- Command: `docker exec ... psql --file -`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
The baseline reset failed, so direct bootstrap was skipped.
```

### Sync (legacy)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **SKIPPED**
- Duration: `0.0s`

```text
Baseline bootstrap failed, so unsupported-capability planning was skipped.
```
<!-- declarative-schema-command-result case="315-boundary-temporary" engine="legacy" command="sync" status="ERROR" -->
