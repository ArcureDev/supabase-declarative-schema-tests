# Case: 199-sequence-ownership

## Baseline state A

```sql
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create sequence public.transition_owned_seq start with 100;

create table public.sequence_owner_guard (
  id bigint primary key default nextval('public.transition_owned_seq'),
  payload text not null
);
```

## Desired state B

```sql
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create sequence public.transition_owned_seq start with 100;

create table public.sequence_owner_guard (
  id bigint primary key default nextval('public.transition_owned_seq'),
  payload text not null
);

alter sequence public.transition_owned_seq
  owned by public.sequence_owner_guard.id;
```

## Representative data setup

```sql
insert into public.transition_anchor values (1, 'preserved');
insert into public.sequence_owner_guard (payload) values ('existing');
```

## CLI-generated baseline migration files

### `20260817173820_199_sequence_ownership_baseline.sql`

```sql
create sequence "public"."transition_owned_seq" as bigint increment by 1 minvalue 1 maxvalue 9223372036854775807 START with 100 cache 1 no cycle;

create table "public"."sequence_owner_guard" (
  "id"      bigint not null default nextval('public.transition_owned_seq'::regclass),
  "payload" text   not null,
  constraint "sequence_owner_guard_pkey" primary key (id)
);

create table "public"."transition_anchor" (
  "id"      bigint not null,
  "payload" text   not null,
  constraint "transition_anchor_pkey" primary key (id)
);

grant update on sequence "public"."transition_owned_seq" to "anon", "authenticated";

grant select, update, usage on sequence "public"."transition_owned_seq" to "postgres";

grant update on sequence "public"."transition_owned_seq" to "service_role";

grant maintain, references, trigger, truncate on table "public"."sequence_owner_guard" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."sequence_owner_guard" to "postgres";

grant maintain, references, trigger, truncate on table "public"."sequence_owner_guard" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260817173900_declarative_sync.sql`

```sql
alter sequence "public"."transition_owned_seq" owned by "public"."sequence_owner_guard"."id";
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.2s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 199_sequence_ownership_baseline --debug`
- Result: **OK**
- Duration: `59.8s`

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
- Duration: `39.6s`
<!-- declarative-schema-command-result case="199-sequence-ownership" engine="next" command="sync" status="OK" -->

## Apply generated transition migration

- Command: `npx supabase migration up --local --debug`
- Result: **OK**
- Duration: `0.5s`

## Verify desired state B

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `40.9s`
<!-- declarative-schema-command-result case="199-sequence-ownership" engine="next" command="sync-verification" status="OK" -->

