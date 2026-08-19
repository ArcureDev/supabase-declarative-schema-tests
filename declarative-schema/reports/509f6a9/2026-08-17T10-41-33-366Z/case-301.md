# Case: 301-move-schema

- Scenario pack: `Schemas, tables, columns, and sequences catalogue scenarios` / `move-schema`
- Catalogue atoms: `PG-CAT-STC-01::move.schema`

## Baseline state A

```sql
-- Covers PG-CAT-STC-01::move.schema. Keep public.transition_anchor identity stable. PostgreSQL RENAME/SET SCHEMA preserves OIDs; an unhinted declarative pair must not silently drop data.
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
-- Covers PG-CAT-STC-01::move.schema. Keep public.transition_anchor identity stable. PostgreSQL RENAME/SET SCHEMA preserves OIDs; an unhinted declarative pair must not silently drop data.
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

### `20260818015453_rename_ambiguity_baseline.sql`

```sql
create table "public"."catalogue_rename_source" (
  "id"    bigint not null,
  "label" text,
  constraint "catalogue_rename_source_pkey" primary key (id)
);

create table "public"."transition_anchor" (
  "id"      bigint not null,
  "payload" text   not null,
  constraint "transition_anchor_pkey" primary key (id)
);

grant maintain, references, trigger, truncate on table "public"."catalogue_rename_source" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."catalogue_rename_source" to "postgres";

grant maintain, references, trigger, truncate on table "public"."catalogue_rename_source" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Rename-ambiguity safety assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The command completed with an explicit ambiguity/destructive-change diagnostic and did not infer a rename. Evidence: Found destructive changes in schema diff. Please double check if these are expected:

## Generated transition migration files

### `20260818015553_declarative_sync.sql`

```sql
drop table "public"."catalogue_rename_source";

create table "public"."catalogue_rename_target" (
  "id"    bigint not null,
  "label" text,
  constraint "catalogue_rename_target_pkey" primary key (id)
);

grant maintain, references, trigger, truncate on table "public"."catalogue_rename_target" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."catalogue_rename_target" to "postgres";

grant maintain, references, trigger, truncate on table "public"."catalogue_rename_target" to "service_role";
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `1.1s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `32.6s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name rename_ambiguity_baseline --debug`
- Result: **OK**
- Duration: `39.7s`

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
- Duration: `59.7s`
<!-- declarative-schema-command-result case="301-move-schema" engine="next" command="sync" status="OK" -->

## Verify unchanged state A after non-applied planning

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`
<!-- declarative-schema-command-result case="301-move-schema" engine="next" command="sync-verification" status="OK" -->

