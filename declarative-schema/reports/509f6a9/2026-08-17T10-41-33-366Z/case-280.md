# Case: 280-common-extension-upgrade-boundary

## Baseline state A

```sql
-- Invariant: application objects may compose extensions without owning versions.
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists pg_trgm with schema extensions;
create extension if not exists unaccent with schema extensions;

create table public.extension_versions_280 (
  extname text primary key,
  extversion text not null
);
create table public.extension_items_280 (
  id uuid primary key default extensions.gen_random_uuid(),
  external_id uuid not null default extensions.uuid_generate_v4(),
  label text not null
);
create function public.normalize_label_280(value text)
returns text
language sql
stable
strict
set search_path = ''
as $function$
  select extensions.unaccent(value)
$function$;
revoke execute on function public.normalize_label_280(text) from public, anon;
grant execute on function public.normalize_label_280(text) to authenticated;
```

## Desired state B

```sql
-- Invariant: extension-backed evolution leaves the extension boundary untouched.
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists pg_trgm with schema extensions;
create extension if not exists unaccent with schema extensions;

create table public.extension_versions_280 (
  extname text primary key,
  extversion text not null
);
create table public.extension_items_280 (
  id uuid primary key default extensions.gen_random_uuid(),
  external_id uuid not null default extensions.uuid_generate_v4(),
  label text not null
);
create index transition_extension_trgm_280
  on public.extension_items_280
  using gin (label extensions.gin_trgm_ops);
create function public.normalize_label_280(value text)
returns text
language sql
stable
strict
set search_path = ''
as $function$
  select lower(extensions.unaccent(value))
$function$;
revoke execute on function public.normalize_label_280(text) from public, anon;
grant execute on function public.normalize_label_280(text) to authenticated;
```

## Representative data setup

```sql
-- Invariant: captured extension versions are runtime evidence, not desired DDL.
insert into public.transition_anchor (case_no, payload)
values (280, 'case-280');

insert into public.extension_versions_280 (extname, extversion)
select extname, extversion
from pg_extension
where extname in ('pgcrypto', 'uuid-ossp', 'pg_trgm', 'unaccent');

insert into public.extension_items_280 (label)
values ('Café Déjà'), ('Cafe Delta');
```

## CLI-generated baseline migration files

### `20260818001736_280_common_extension_upgrade_boundary_baseline.sql`

```sql
set local check_function_bodies = off;

create extension "pg_trgm" schema "extensions";

create extension "unaccent" schema "extensions";

create table "public"."extension_items_280" (
  "id"          uuid not null default extensions.gen_random_uuid(),
  "external_id" uuid not null default extensions.uuid_generate_v4(),
  "label"       text not null,
  constraint "extension_items_280_pkey" primary key (id)
);

create table "public"."extension_versions_280" (
  "extname"    text not null,
  "extversion" text not null,
  constraint "extension_versions_280_pkey" primary key (extname)
);

create table "public"."transition_anchor" (
  "case_no" integer not null,
  "payload" text    not null,
  constraint "transition_anchor_pkey" primary key (case_no)
);

create or replace function public.normalize_label_280 (
  value text
)
  returns text
  language sql
  stable
  strict
  set search_path to ''
  AS $function$
  select extensions.unaccent(value)
$function$;

comment on extension "pg_trgm" is 'text similarity measurement and index searching based on trigrams';

comment on extension "unaccent" is 'text search dictionary that removes accents';

revoke all on function "public"."normalize_label_280"(text) from public;

grant execute on function "public"."normalize_label_280"(text) to "authenticated", "postgres";

grant maintain, references, trigger, truncate on table "public"."extension_items_280" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."extension_items_280" to "postgres";

grant maintain, references, trigger, truncate on table "public"."extension_items_280" to "service_role";

grant maintain, references, trigger, truncate on table "public"."extension_versions_280" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."extension_versions_280" to "postgres";

grant maintain, references, trigger, truncate on table "public"."extension_versions_280" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260818001836_declarative_sync.sql`

```sql
set local check_function_bodies = off;

create or replace function public.normalize_label_280 (
  value text
)
  returns text
  language sql
  stable
  strict
  set search_path to ''
  AS $function$
  select lower(extensions.unaccent(value))
$function$;

create index transition_extension_trgm_280 on public.extension_items_280 using gin (label extensions.gin_trgm_ops);
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `31.5s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 280_common_extension_upgrade_boundary_baseline --debug`
- Result: **OK**
- Duration: `59.3s`

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
- Duration: `60.1s`
<!-- declarative-schema-command-result case="280-common-extension-upgrade-boundary" engine="next" command="sync" status="OK" -->

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
- Duration: `50.2s`
<!-- declarative-schema-command-result case="280-common-extension-upgrade-boundary" engine="next" command="sync-verification" status="OK" -->

