# Case: 103-custom-cast

## Fixture migration SQL

```sql
create type public.cents as (
  amount integer
);

create function public.cents_to_integer(value public.cents)
returns integer
language sql
immutable
strict
as $$
  select value.amount;
$$;

create cast (public.cents as integer)
with function public.cents_to_integer(public.cents)
as assignment;
```

## Generated declarative files (pg-delta next)

### `_cluster/extensions/pgcrypto.sql`

```sql
create extension "pgcrypto" schema "extensions";

comment on extension "pgcrypto" is 'cryptographic functions';
```

### `_cluster/extensions/uuid-ossp.sql`

```sql
create extension "uuid-ossp" schema "extensions";

comment on extension "uuid-ossp" is 'generate universally unique identifiers (UUIDs)';
```

### `.pgdelta-export.json`

```sql
{
  "formatVersion": 1,
  "redactSecrets": true,
  "scope": "database",
  "profile": "supabase",
  "defaultOwner": "postgres",
  "files": [
    "_cluster/extensions/pgcrypto.sql",
    "_cluster/extensions/uuid-ossp.sql",
    "public/default_privileges.sql",
    "public/functions/cents_to_integer.sql",
    "public/schema.sql",
    "public/types/cents.sql"
  ]
}
```

### `public/default_privileges.sql`

```sql
alter default privileges for role "postgres" in schema "public" grant update on sequences to "anon";

alter default privileges for role "postgres" in schema "public" grant update on sequences to "authenticated";

alter default privileges for role "postgres" in schema "public" grant update on sequences to "service_role";

alter default privileges for role "postgres" in schema "public" revoke all on FUNCTIONS from public;

alter default privileges for role "postgres" in schema "public" grant maintain, references, trigger, truncate on tables to "anon";

alter default privileges for role "postgres" in schema "public" grant maintain, references, trigger, truncate on tables to "authenticated";

alter default privileges for role "postgres" in schema "public" grant maintain, references, trigger, truncate on tables to "service_role";
```

### `public/functions/cents_to_integer.sql`

```sql
create or replace function public.cents_to_integer (
  value public.cents
)
  returns integer
  language sql
  immutable
  strict
  AS $function$
  select value.amount;
$function$;

grant execute on function "public"."cents_to_integer"(public.cents) to public, "postgres";
```

### `public/schema.sql`

```sql
comment on schema "public" is 'standard public schema';

revoke all on schema "public" from public;

grant usage on schema "public" to public;

revoke all on schema "public" from "anon";

grant usage on schema "public" to "anon";

revoke all on schema "public" from "authenticated";

grant usage on schema "public" to "authenticated";

revoke all on schema "public" from "pg_database_owner";

grant create, usage on schema "public" to "pg_database_owner";

revoke all on schema "public" from "postgres";

grant usage on schema "public" to "postgres";

revoke all on schema "public" from "service_role";

grant usage on schema "public" to "service_role";
```

### `public/types/cents.sql`

```sql
create type "public"."cents" as (
  "amount" integer
);

grant usage on type "public"."cents" to "postgres";
```


## Generated declarative files (legacy)

### `schemas/public/functions/cents_to_integer.sql`

```sql
CREATE FUNCTION public.cents_to_integer (
  value public.cents
)
  RETURNS integer
  LANGUAGE sql
  IMMUTABLE
  STRICT
  AS $function$
  select value.amount;
$function$;
```

### `schemas/public/schema.sql`

```sql
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE DELETE, INSERT, SELECT, UPDATE ON TABLES FROM anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE SELECT, USAGE ON SEQUENCES FROM anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON ROUTINES FROM anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE DELETE, INSERT, SELECT, UPDATE ON TABLES FROM authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE SELECT, USAGE ON SEQUENCES FROM authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON ROUTINES FROM authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE DELETE, INSERT, SELECT, UPDATE ON TABLES FROM service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE SELECT, USAGE ON SEQUENCES FROM service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON ROUTINES FROM service_role;
```

### `schemas/public/types/cents.sql`

```sql
CREATE TYPE public.cents AS (
  amount integer
);
```


## Reset

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.8s`

## Generate (pg-delta next)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **WARNING**
- Duration: `0.8s`
- Exit code: `0`

```text
Warning: the CLI exited successfully but reported an unmodeled object kind; the exported declarative schema is incomplete.
│
▲  pg-delta does not manage these PostgreSQL object kinds: cast. These objects are omitted from the exported declarative schema.
│
●  Request pg-delta support:
│    supabase issue feature --problem 'pg-delta does not manage these PostgreSQL object kinds: cast' --proposed-solution 'Add pg-delta support for these PostgreSQL object kinds.'
Finished supabase db schema declarative generate.
NotFound: FileSystem.readFile (C:\Users\Arcure\.supabase\profile)
Using pg-delta next implementation.
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:auth.users.confirmed_at message=edge default:auth.users.confirmed_at -[depends]-> column:auth.users.email_confirmed_at references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey message=edge constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey -[depends]-> column:realtime.messages_2026_08_16.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:realtime.messages_2026_08_16.inserted_at message=edge default:realtime.messages_2026_08_16.inserted_at -[depends]-> column:realtime.messages_2026_08_16.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:vault.secrets.updated_at message=edge default:vault.secrets.updated_at -[depends]-> column:vault.secrets.updated_at references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=column:vault.secrets.updated_at message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.updated_at references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.extension references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey message=edge constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey -[depends]-> column:realtime.messages_2026_08_17.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:realtime.messages_2026_08_17.inserted_at message=edge default:realtime.messages_2026_08_17.inserted_at -[depends]-> column:realtime.messages_2026_08_17.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=column:vault.secrets.key_id message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.key_id references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=index:realtime.messages_2026_08_19_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_19_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_19.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=constraint:realtime.messages_2026_08_19.messages_2026_08_19_pkey message=edge constraint:realtime.messages_2026_08_19.messages_2026_08_19_pkey -[depends]-> column:realtime.messages_2026_08_19.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:realtime.messages_2026_08_19.inserted_at message=edge default:realtime.messages_2026_08_19.inserted_at -[depends]-> column:realtime.messages_2026_08_19.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=constraint:realtime.messages_2026_08_19.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_19.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_19.payload references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_17.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_17.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:vault.secrets.created_at message=edge default:vault.secrets.created_at -[depends]-> column:vault.secrets.created_at references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=column:vault.secrets.created_at message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.created_at references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey message=edge constraint:realtime.messages_2026_08_17.messages_2026_08_17_pkey -[depends]-> column:realtime.messages_2026_08_17.id references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:realtime.messages_2026_08_17.id message=edge default:realtime.messages_2026_08_17.id -[depends]-> column:realtime.messages_2026_08_17.id references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_18.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_18.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:realtime.subscription.claims_role message=edge default:realtime.subscription.claims_role -[depends]-> column:realtime.subscription.claims references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=index:realtime.messages_2026_08_20_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_20_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_20.extension references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.topic references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:auth.users.confirmed_at message=edge default:auth.users.confirmed_at -[depends]-> column:auth.users.phone_confirmed_at references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=index:vault.secrets_name_idx message=edge index:vault.secrets_name_idx -[depends]-> column:vault.secrets.name references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=column:vault.secrets.name message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.name references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey message=edge constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey -[depends]-> column:realtime.messages_2026_08_18.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:realtime.messages_2026_08_18.inserted_at message=edge default:realtime.messages_2026_08_18.inserted_at -[depends]-> column:realtime.messages_2026_08_18.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=index:realtime.messages_2026_08_19_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_19_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_19.private references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:realtime.messages_2026_08_19.private message=edge default:realtime.messages_2026_08_19.private -[depends]-> column:realtime.messages_2026_08_19.private references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:vault.secrets.nonce message=edge default:vault.secrets.nonce -[depends]-> column:vault.secrets.nonce references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=column:vault.secrets.nonce message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.nonce references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:vault.secrets.id message=edge default:vault.secrets.id -[depends]-> column:vault.secrets.id references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=constraint:vault.secrets.secrets_pkey message=edge constraint:vault.secrets.secrets_pkey -[depends]-> column:vault.secrets.id references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=column:vault.secrets.id message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.id references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_16.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_16.payload references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey message=edge constraint:realtime.messages_2026_08_16.messages_2026_08_16_pkey -[depends]-> column:realtime.messages_2026_08_16.id references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:realtime.messages_2026_08_16.id message=edge default:realtime.messages_2026_08_16.id -[depends]-> column:realtime.messages_2026_08_16.id references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.private references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:realtime.messages_2026_08_16.private message=edge default:realtime.messages_2026_08_16.private -[depends]-> column:realtime.messages_2026_08_16.private references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:auth.identities.email message=edge default:auth.identities.email -[depends]-> column:auth.identities.identity_data references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=constraint:realtime.messages_2026_08_20.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_20.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_20.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.extension references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey message=edge constraint:realtime.messages_2026_08_18.messages_2026_08_18_pkey -[depends]-> column:realtime.messages_2026_08_18.id references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:realtime.messages_2026_08_18.id message=edge default:realtime.messages_2026_08_18.id -[depends]-> column:realtime.messages_2026_08_18.id references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:realtime.messages_2026_08_18.updated_at message=edge default:realtime.messages_2026_08_18.updated_at -[depends]-> column:realtime.messages_2026_08_18.updated_at references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.extension references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=index:realtime.messages_2026_08_20_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_20_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_20.private references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:realtime.messages_2026_08_20.private message=edge default:realtime.messages_2026_08_20.private -[depends]-> column:realtime.messages_2026_08_20.private references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:realtime.messages_2026_08_19.updated_at message=edge default:realtime.messages_2026_08_19.updated_at -[depends]-> column:realtime.messages_2026_08_19.updated_at references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=constraint:realtime.messages_2026_08_19.messages_2026_08_19_pkey message=edge constraint:realtime.messages_2026_08_19.messages_2026_08_19_pkey -[depends]-> column:realtime.messages_2026_08_19.id references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:realtime.messages_2026_08_19.id message=edge default:realtime.messages_2026_08_19.id -[depends]-> column:realtime.messages_2026_08_19.id references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:vault.secrets.nonce message=edge default:vault.secrets.nonce -[depends]-> extension:supabase_vault references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=column:vault.secrets.nonce message=edge column:vault.secrets.nonce -[depends]-> extension:supabase_vault references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.private references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:realtime.messages_2026_08_17.private message=edge default:realtime.messages_2026_08_17.private -[depends]-> column:realtime.messages_2026_08_17.private references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=constraint:realtime.messages_2026_08_20.messages_2026_08_20_pkey message=edge constraint:realtime.messages_2026_08_20.messages_2026_08_20_pkey -[depends]-> column:realtime.messages_2026_08_20.id references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:realtime.messages_2026_08_20.id message=edge default:realtime.messages_2026_08_20.id -[depends]-> column:realtime.messages_2026_08_20.id references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=constraint:realtime.messages_2026_08_18.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_18.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_18.payload references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=column:vault.secrets.secret message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.secret references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:realtime.messages_2026_08_17.updated_at message=edge default:realtime.messages_2026_08_17.updated_at -[depends]-> column:realtime.messages_2026_08_17.updated_at references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=index:realtime.messages_2026_08_19_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_19_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_19.topic references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=index:realtime.messages_2026_08_16_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_16_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_16.topic references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:storage.objects.path_tokens message=edge default:storage.objects.path_tokens -[depends]-> column:storage.objects.name references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:realtime.messages_2026_08_16.updated_at message=edge default:realtime.messages_2026_08_16.updated_at -[depends]-> column:realtime.messages_2026_08_16.updated_at references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=index:realtime.messages_2026_08_18_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_18_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_18.private references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:realtime.messages_2026_08_18.private message=edge default:realtime.messages_2026_08_18.private -[depends]-> column:realtime.messages_2026_08_18.private references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=constraint:realtime.messages_2026_08_20.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_20.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_20.payload references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:realtime.subscription.claims_role message=edge default:realtime.subscription.claims_role -[depends]-> function:realtime.to_regrole(text) references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=constraint:realtime.messages_2026_08_19.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_19.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_19.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=constraint:realtime.messages_2026_08_17.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_17.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_17.payload references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=index:realtime.messages_2026_08_17_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_17_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_17.topic references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:vault.secrets.description message=edge default:vault.secrets.description -[depends]-> column:vault.secrets.description references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=column:vault.secrets.description message=edge view:vault.decrypted_secrets -[depends]-> column:vault.secrets.description references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=sequence:realtime.subscription_id_seq message=edge sequence:realtime.subscription_id_seq -[depends]-> schema:realtime references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=index:realtime.messages_2026_08_19_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_19_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_19.extension references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:realtime.messages_2026_08_20.updated_at message=edge default:realtime.messages_2026_08_20.updated_at -[depends]-> column:realtime.messages_2026_08_20.updated_at references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=index:realtime.messages_2026_08_20_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_20_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_20.topic references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=constraint:realtime.messages_2026_08_16.messages_payload_exclusive message=edge constraint:realtime.messages_2026_08_16.messages_payload_exclusive -[depends]-> column:realtime.messages_2026_08_16.binary_payload references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=index:realtime.messages_2026_08_20_inserted_at_topic_idx message=edge index:realtime.messages_2026_08_20_inserted_at_topic_idx -[depends]-> column:realtime.messages_2026_08_20.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=constraint:realtime.messages_2026_08_20.messages_2026_08_20_pkey message=edge constraint:realtime.messages_2026_08_20.messages_2026_08_20_pkey -[depends]-> column:realtime.messages_2026_08_20.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=export code=dangling_edge subject=default:realtime.messages_2026_08_20.inserted_at message=edge default:realtime.messages_2026_08_20.inserted_at -[depends]-> column:realtime.messages_2026_08_20.inserted_at references a fact not in the base
pg-delta next diagnostic: origin=export code=unmodeled_kind message=1 unmodeled "cast" object not managed by this engine (e.g. public.cents AS integer) — v1 detects but does not model this kind; keep its DDL in _custom/ so re-exports preserve it and the shadow can elaborate dependents, and deliver it to targets via your migration channel
Declarative schema written to supabase\database
A new version of Supabase CLI is available: v2.114.0 (currently installed v0.0.0-pr.6102)
We recommend updating regularly for new features and bug fixes: https://supabase.com/docs/guides/cli/getting-started#updating-the-supabase-cli
```
<!-- declarative-schema-command-result case="103-custom-cast" engine="next" command="generate" status="WARNING" -->

## Generate fallback (legacy)

- Command: `npx supabase db schema declarative generate --local --overwrite --debug`
- Result: **OK**
- Duration: `46.9s`
<!-- declarative-schema-command-result case="103-custom-cast" engine="legacy" command="generate" status="OK" -->

## Sync (pg-delta next)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `50.6s`
<!-- declarative-schema-command-result case="103-custom-cast" engine="next" command="sync" status="OK" -->

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `50.8s`
<!-- declarative-schema-command-result case="103-custom-cast" engine="next" command="sync-verification" status="OK" -->

## Sync fallback (legacy)

- Command: `npx supabase db schema declarative sync --debug`
- Result: **OK**
- Duration: `32.1s`
<!-- declarative-schema-command-result case="103-custom-cast" engine="legacy" command="sync" status="OK" -->

## Sync verification fallback (legacy)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `32.3s`
<!-- declarative-schema-command-result case="103-custom-cast" engine="legacy" command="sync-verification" status="OK" -->

