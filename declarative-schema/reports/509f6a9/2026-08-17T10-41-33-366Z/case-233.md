# Case: 233-pgvector-index-addition

## Baseline state A

```sql
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists vector with schema extensions;
create table public.vector_items_233 (
  id bigint generated always as identity primary key,
  embedding extensions.vector(3) not null
);
```

## Desired state B

```sql
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists vector with schema extensions;
create table public.vector_items_233 (
  id bigint generated always as identity primary key,
  embedding extensions.vector(3) not null
);
create index transition_vector_hnsw_233
  on public.vector_items_233
  using hnsw (embedding extensions.vector_cosine_ops)
  with (m = 8, ef_construction = 32);
```

## Representative data setup

```sql
insert into public.transition_anchor (case_no, payload)
values (233, 'case-233');

insert into public.vector_items_233 (embedding)
values ('[1,0,0]'::extensions.vector), ('[0,1,0]'::extensions.vector);
```

## CLI-generated baseline migration files

### `20260817201706_233_pgvector_index_addition_baseline.sql`

```sql
set local check_function_bodies = off;

create extension "vector" schema "extensions";

create table "public"."transition_anchor" (
  "case_no" integer not null,
  "payload" text    not null,
  constraint "transition_anchor_pkey" primary key (case_no)
);

create table "public"."vector_items_233" (
  "id"        bigint               generated always as identity not null,
  "embedding" extensions.vector(3) not null,
  constraint "vector_items_233_pkey" primary key (id)
);

comment on extension "vector" is 'vector data type and ivfflat and hnsw access methods';

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";

grant maintain, references, trigger, truncate on table "public"."vector_items_233" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."vector_items_233" to "postgres";

grant maintain, references, trigger, truncate on table "public"."vector_items_233" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260817201747_declarative_sync.sql`

```sql
create index transition_vector_hnsw_233 on public.vector_items_233 using hnsw (embedding extensions.vector_cosine_ops)
  with (m='8', ef_construction='32');
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.3s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 233_pgvector_index_addition_baseline --debug`
- Result: **OK**
- Duration: `40.3s`

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
<!-- declarative-schema-command-result case="233-pgvector-index-addition" engine="next" command="sync" status="OK" -->

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
- Duration: `40.2s`
<!-- declarative-schema-command-result case="233-pgvector-index-addition" engine="next" command="sync-verification" status="OK" -->

