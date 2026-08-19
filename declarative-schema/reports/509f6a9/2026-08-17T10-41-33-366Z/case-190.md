# Case: 190-table-persistence

## Baseline state A

```sql
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.persistence_guard (
  id bigint primary key,
  payload text not null
);
```

## Desired state B

```sql
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create unlogged table public.persistence_guard (
  id bigint primary key,
  payload text not null
);
```

## Representative data setup

```sql
insert into public.transition_anchor values (1, 'preserved');
insert into public.persistence_guard values (1, 'existing');
```

## CLI-generated baseline migration files

### `20260817171059_190_table_persistence_baseline.sql`

```sql
create table "public"."persistence_guard" (
  "id"      bigint not null,
  "payload" text   not null,
  constraint "persistence_guard_pkey" primary key (id)
);

create table "public"."transition_anchor" (
  "id"      bigint not null,
  "payload" text   not null,
  constraint "transition_anchor_pkey" primary key (id)
);

grant maintain, references, trigger, truncate on table "public"."persistence_guard" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."persistence_guard" to "postgres";

grant maintain, references, trigger, truncate on table "public"."persistence_guard" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260817171226_declarative_sync.sql`

```sql
alter table "public"."persistence_guard"
  set unlogged;
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `22.9s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 190_table_persistence_baseline --debug`
- Result: **OK**
- Duration: `87.5s`

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
- Duration: `86.7s`
<!-- declarative-schema-command-result case="190-table-persistence" engine="next" command="sync" status="OK" -->

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
- Duration: `60.0s`
<!-- declarative-schema-command-result case="190-table-persistence" engine="next" command="sync-verification" status="OK" -->

