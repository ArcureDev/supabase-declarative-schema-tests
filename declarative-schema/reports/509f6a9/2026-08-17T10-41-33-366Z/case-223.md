# Case: 223-extension-dependent-index

## Baseline state A

```sql
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create table public.extension_docs_223 (
  id bigint generated always as identity primary key,
  body text not null
);
```

## Desired state B

```sql
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists pg_trgm with schema extensions;
create table public.extension_docs_223 (
  id bigint generated always as identity primary key,
  body text not null
);
create index transition_docs_trgm_223
  on public.extension_docs_223
  using gin (body extensions.gin_trgm_ops);
```

## Representative data setup

```sql
insert into public.transition_anchor (case_no, payload)
values (223, 'case-223');

insert into public.extension_docs_223 (body)
values ('declarative schemas'), ('schema transitions');
```

## CLI-generated baseline migration files

### `20260817194525_223_extension_dependent_index_baseline.sql`

```sql
create table "public"."extension_docs_223" (
  "id"   bigint generated always as identity not null,
  "body" text   not null,
  constraint "extension_docs_223_pkey" primary key (id)
);

create table "public"."transition_anchor" (
  "case_no" integer not null,
  "payload" text    not null,
  constraint "transition_anchor_pkey" primary key (case_no)
);

grant maintain, references, trigger, truncate on table "public"."extension_docs_223" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."extension_docs_223" to "postgres";

grant maintain, references, trigger, truncate on table "public"."extension_docs_223" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260817194606_declarative_sync.sql`

```sql
set local check_function_bodies = off;

create extension "pg_trgm" schema "extensions";

create index transition_docs_trgm_223 on public.extension_docs_223 using gin (body extensions.gin_trgm_ops);

comment on extension "pg_trgm" is 'text similarity measurement and index searching based on trigrams';
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `1.4s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `20.7s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 223_extension_dependent_index_baseline --debug`
- Result: **OK**
- Duration: `49.9s`

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
<!-- declarative-schema-command-result case="223-extension-dependent-index" engine="next" command="sync" status="OK" -->

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
- Duration: `40.0s`
<!-- declarative-schema-command-result case="223-extension-dependent-index" engine="next" command="sync-verification" status="OK" -->

