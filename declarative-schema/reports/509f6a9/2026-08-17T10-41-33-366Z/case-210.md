# Case: 210-composite-range-evolution

## Baseline state A

```sql
create table public.transition_anchor (
  id bigint generated always as identity primary key,
  label text not null
);

create type public.transition_pair as (
  left_value integer,
  right_value integer
);

create type public.transition_int_span as range (
  subtype = integer
);

create table public.transition_shape_rows (
  id bigint generated always as identity primary key,
  payload public.transition_pair not null,
  span public.transition_int_span not null
);
```

## Desired state B

```sql
create table public.transition_anchor (
  id bigint generated always as identity primary key,
  label text not null
);

create type public.transition_pair as (
  left_value integer,
  right_value integer,
  unit text
);

create type public.transition_int_span as range (
  subtype = integer
);

create type public.transition_date_span as range (
  subtype = date
);

create table public.transition_shape_rows (
  id bigint generated always as identity primary key,
  payload public.transition_pair not null,
  span public.transition_int_span not null
);
```

## Representative data setup

```sql
insert into public.transition_anchor (label) values ('210');
insert into public.transition_shape_rows (payload, span)
values (row(1, 2), '[1,4)');
```

## CLI-generated baseline migration files

### `20260817181157_210_composite_range_evolution_baseline.sql`

```sql
create table "public"."transition_anchor" (
  "id"    bigint generated always as identity not null,
  "label" text   not null,
  constraint "transition_anchor_pkey" primary key (id)
);

create table "public"."transition_shape_rows" (
  "id" bigint generated always as identity not null,
  constraint "transition_shape_rows_pkey" primary key (id)
);

create type "public"."transition_int_span" as range (
  subtype              = integer,
  MULTIRANGE_TYPE_NAME = public.transition_int_span_multirange
);

alter table "public"."transition_shape_rows"
  add column "span" public.transition_int_span not null;

create type "public"."transition_pair" as (
  "left_value"  integer,
  "right_value" integer
);

alter table "public"."transition_shape_rows"
  add column "payload" public.transition_pair not null;

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_shape_rows" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_shape_rows" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_shape_rows" to "service_role";

grant usage on type "public"."transition_int_span" to "postgres";

grant usage on type "public"."transition_pair" to "postgres";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260817181238_declarative_sync.sql`

```sql
create type "public"."transition_date_span" as range (
  subtype              = date,
  MULTIRANGE_TYPE_NAME = public.transition_date_span_multirange
);

alter type "public"."transition_pair" add attribute "unit" text cascade;

grant usage on type "public"."transition_date_span" to "postgres";
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.1s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 210_composite_range_evolution_baseline --debug`
- Result: **OK**
- Duration: `39.8s`

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
- Duration: `40.4s`
<!-- declarative-schema-command-result case="210-composite-range-evolution" engine="next" command="sync" status="OK" -->

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
- Duration: `39.9s`
<!-- declarative-schema-command-result case="210-composite-range-evolution" engine="next" command="sync-verification" status="OK" -->

