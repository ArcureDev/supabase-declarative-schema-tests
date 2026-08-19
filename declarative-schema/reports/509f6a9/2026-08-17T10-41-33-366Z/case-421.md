# Case: 421-index-brin

- Scenario pack: `Constraints, indexes, statistics, and rules catalogue scenarios` / `index-brin`
- Catalogue atoms: `PG-CAT-CIX-06::index.brin`

## Baseline state A

```sql
-- Covers PG-CAT-CIX-06::index.brin. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_index_brin (
  id bigint primary key, label text
);
```

## Desired state B

```sql
-- Covers PG-CAT-CIX-06::index.brin. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_index_brin (
  id bigint primary key, label text, extra text
);
```

## Representative data setup

```sql
insert into public.transition_anchor values (1, 'preserved');
```

## CLI-generated baseline migration files

### `20260818105808_421_index_brin_baseline.sql`

```sql
create table "public"."catalogue_index_brin" (
  "id"    bigint not null,
  "label" text,
  constraint "catalogue_index_brin_pkey" primary key (id)
);

create table "public"."transition_anchor" (
  "id"      bigint not null,
  "payload" text   not null,
  constraint "transition_anchor_pkey" primary key (id)
);

grant maintain, references, trigger, truncate on table "public"."catalogue_index_brin" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."catalogue_index_brin" to "postgres";

grant maintain, references, trigger, truncate on table "public"."catalogue_index_brin" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260818105849_declarative_sync.sql`

```sql
alter table "public"."catalogue_index_brin"
  add column "extra" text;
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.8s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `32.3s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 421_index_brin_baseline --debug`
- Result: **OK**
- Duration: `50.0s`

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
- Duration: `40.1s`
<!-- declarative-schema-command-result case="421-index-brin" engine="next" command="sync" status="OK" -->

## Apply generated transition migration

- Command: `npx supabase migration up --local --debug`
- Result: **OK**
- Duration: `0.6s`

## Verify desired state B

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `59.5s`
<!-- declarative-schema-command-result case="421-index-brin" engine="next" command="sync-verification" status="OK" -->

