# Case: 272-pgvector-dimension-change-safety

## Baseline state A

```sql
-- Invariant: compatible four-dimensional rows survive typmod tightening.
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists vector with schema extensions;
create table public.vector_dimensions_272 (
  id bigint generated always as identity primary key,
  embedding extensions.vector not null,
  label text not null
);
```

## Desired state B

```sql
-- Invariant: the table is altered in place, never rebuilt for a typmod change.
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists vector with schema extensions;
create table public.vector_dimensions_272 (
  id bigint generated always as identity primary key,
  embedding extensions.vector(4) not null,
  label text not null
);
```

## Representative data setup

```sql
-- Invariant: every populated vector is compatible with the desired dimension.
insert into public.transition_anchor (case_no, payload)
values (272, 'case-272');

insert into public.vector_dimensions_272 (embedding, label)
values
  ('[1,0,0,0]'::extensions.vector, 'north'),
  ('[0,1,0,0]'::extensions.vector, 'east');
```

## CLI-generated baseline migration files

### `20260817235453_272_pgvector_dimension_change_safety_baseline.sql`

```sql
set local check_function_bodies = off;

create extension "vector" schema "extensions";

create table "public"."transition_anchor" (
  "case_no" integer not null,
  "payload" text    not null,
  constraint "transition_anchor_pkey" primary key (case_no)
);

create table "public"."vector_dimensions_272" (
  "id"        bigint            generated always as identity not null,
  "embedding" extensions.vector not null,
  "label"     text              not null,
  constraint "vector_dimensions_272_pkey" primary key (id)
);

comment on extension "vector" is 'vector data type and ivfflat and hnsw access methods';

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";

grant maintain, references, trigger, truncate on table "public"."vector_dimensions_272" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."vector_dimensions_272" to "postgres";

grant maintain, references, trigger, truncate on table "public"."vector_dimensions_272" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260817235543_declarative_sync.sql`

```sql
set local check_function_bodies = off;

alter table "public"."vector_dimensions_272"
  alter column "embedding" drop default;

alter table "public"."vector_dimensions_272"
  alter column "embedding" type extensions.vector(4) using "embedding"::extensions.vector(4);
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `31.3s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 272_pgvector_dimension_change_safety_baseline --debug`
- Result: **OK**
- Duration: `40.4s`

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
- Duration: `49.4s`
<!-- declarative-schema-command-result case="272-pgvector-dimension-change-safety" engine="next" command="sync" status="OK" -->

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
- Duration: `59.5s`
<!-- declarative-schema-command-result case="272-pgvector-dimension-change-safety" engine="next" command="sync-verification" status="OK" -->

