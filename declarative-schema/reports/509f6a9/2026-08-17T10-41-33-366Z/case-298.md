# Case: 298-create-schema

- Scenario pack: `Schemas, tables, columns, and sequences catalogue scenarios` / `create-schema`
- Catalogue atoms: `PG-CAT-STC-01::create.schema`

## Baseline state A

```sql
-- Covers PG-CAT-STC-01::create.schema. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);
```

## Desired state B

```sql
-- Covers PG-CAT-STC-01::create.schema. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create schema catalogue_create_schema;
```

## Representative data setup

```sql
insert into public.transition_anchor values (1, 'preserved');
```

## CLI-generated baseline migration files

### `20260818014634_298_create_schema_baseline.sql`

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

### `20260818014715_declarative_sync.sql`

```sql
create schema "catalogue_create_schema";

grant create, usage on schema "catalogue_create_schema" to "postgres";
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `32.2s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 298_create_schema_baseline --debug`
- Result: **OK**
- Duration: `50.2s`

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
- Duration: `40.5s`
<!-- declarative-schema-command-result case="298-create-schema" engine="next" command="sync" status="OK" -->

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
- Duration: `49.8s`
<!-- declarative-schema-command-result case="298-create-schema" engine="next" command="sync-verification" status="OK" -->

