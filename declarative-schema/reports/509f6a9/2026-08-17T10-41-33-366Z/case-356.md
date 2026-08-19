# Case: 356-create-sequence

- Scenario pack: `Schemas, tables, columns, and sequences catalogue scenarios` / `create-sequence`
- Catalogue atoms: `PG-CAT-STC-09::create.sequence`

## Baseline state A

```sql
-- Covers PG-CAT-STC-09::create.sequence. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);
```

## Desired state B

```sql
-- Covers PG-CAT-STC-09::create.sequence. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create sequence public.catalogue_create_sequence;
```

## Representative data setup

```sql
insert into public.transition_anchor values (1, 'preserved');
```

## CLI-generated baseline migration files

### `20260818074029_356_create_sequence_baseline.sql`

```sql
create table "public"."transition_anchor" (
  "id"      bigint not null,
  "payload" text   not null,
  constraint "transition_anchor_pkey" primary key (id)
);

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260818074119_declarative_sync.sql`

```sql
create sequence "public"."catalogue_create_sequence" as bigint increment by 1 minvalue 1 maxvalue 9223372036854775807 START with 1 cache 1 no cycle;

grant update on sequence "public"."catalogue_create_sequence" to "anon", "authenticated";

grant select, update, usage on sequence "public"."catalogue_create_sequence" to "postgres";

grant update on sequence "public"."catalogue_create_sequence" to "service_role";
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `1.0s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `33.3s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 356_create_sequence_baseline --debug`
- Result: **OK**
- Duration: `40.1s`

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
- Duration: `50.1s`
<!-- declarative-schema-command-result case="356-create-sequence" engine="next" command="sync" status="OK" -->

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
- Duration: `41.1s`
<!-- declarative-schema-command-result case="356-create-sequence" engine="next" command="sync-verification" status="OK" -->

