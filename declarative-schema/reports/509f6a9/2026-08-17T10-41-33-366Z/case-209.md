# Case: 209-enum-domain-evolution

## Baseline state A

```sql
create table public.transition_anchor (
  id bigint generated always as identity primary key,
  label text not null
);

create type public.transition_status as enum ('new', 'done');

create domain public.transition_code as text
  default 'draft'
  check (value <> '');

create table public.transition_type_rows (
  id bigint generated always as identity primary key,
  status public.transition_status not null,
  code public.transition_code not null
);
```

## Desired state B

```sql
create table public.transition_anchor (
  id bigint generated always as identity primary key,
  label text not null
);

create type public.transition_status as enum ('new', 'reviewing', 'done');

create domain public.transition_code as text
  default 'queued'
  check (value <> '');

create table public.transition_type_rows (
  id bigint generated always as identity primary key,
  status public.transition_status not null,
  code public.transition_code not null
);
```

## Representative data setup

```sql
insert into public.transition_anchor (label) values ('209');
insert into public.transition_type_rows (status, code) values ('new', 'alpha');
```

## CLI-generated baseline migration files

### `20260817180812_209_enum_domain_evolution_baseline.sql`

```sql
create table "public"."transition_anchor" (
  "id"    bigint generated always as identity not null,
  "label" text   not null,
  constraint "transition_anchor_pkey" primary key (id)
);

create table "public"."transition_type_rows" (
  "id" bigint generated always as identity not null,
  constraint "transition_type_rows_pkey" primary key (id)
);

create domain "public"."transition_code" as text
  default 'draft'::text constraint "transition_code_check"
  check ((VALUE <> ''::text));

alter table "public"."transition_type_rows"
  add column "code" public.transition_code not null;

create type "public"."transition_status" as enum (
  'new',
  'done'
);

alter table "public"."transition_type_rows"
  add column "status" public.transition_status not null;

grant usage on type "public"."transition_code" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_type_rows" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_type_rows" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_type_rows" to "service_role";

grant usage on type "public"."transition_status" to "postgres";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260817180930_declarative_sync.sql`

```sql
alter domain "public"."transition_code"
  set default 'queued'::text;

alter type "public"."transition_status" add value 'reviewing' before 'done';
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.0s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 209_enum_domain_evolution_baseline --debug`
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
- Duration: `77.7s`
<!-- declarative-schema-command-result case="209-enum-domain-evolution" engine="next" command="sync" status="OK" -->

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
- Duration: `82.9s`
<!-- declarative-schema-command-result case="209-enum-domain-evolution" engine="next" command="sync-verification" status="OK" -->

