# Case: 214-aggregate-definition-evolution

## Baseline state A

```sql
create table public.transition_anchor (
  id bigint generated always as identity primary key,
  label text not null
);

create table public.transition_numbers (
  value integer not null
);

create function public.transition_sum_state(state integer, value integer)
returns integer
language sql
immutable
strict
as $$
  select state + value
$$;

create aggregate public.transition_sum(integer) (
  sfunc = public.transition_sum_state,
  stype = integer,
  initcond = '0'
);
```

## Desired state B

```sql
create table public.transition_anchor (
  id bigint generated always as identity primary key,
  label text not null
);

create table public.transition_numbers (
  value integer not null
);

create function public.transition_sum_state(state integer, value integer)
returns integer
language sql
immutable
strict
as $$
  select state + value
$$;

create aggregate public.transition_sum(integer) (
  sfunc = public.transition_sum_state,
  stype = integer,
  initcond = '10'
);
```

## Representative data setup

```sql
insert into public.transition_anchor (label) values ('214');
insert into public.transition_numbers (value) values (2), (3);
```

## CLI-generated baseline migration files

### `20260817192159_214_aggregate_definition_evolution_baseline.sql`

```sql
set local check_function_bodies = off;

create table "public"."transition_anchor" (
  "id"    bigint generated always as identity not null,
  "label" text   not null,
  constraint "transition_anchor_pkey" primary key (id)
);

create table "public"."transition_numbers" (
  "value" integer not null
);

create or replace function public.transition_sum_state (
  state integer,
  value integer
)
  returns integer
  language sql
  immutable
  strict
  AS $function$
  select state + value
$function$;

create aggregate "public"."transition_sum"(integer) (
  sfunc    = public.transition_sum_state,
  stype    = integer,
  initcond = '0'
);

grant execute on function "public"."transition_sum"(integer) to public, "postgres";

grant execute on function "public"."transition_sum_state"(integer, integer) to public, "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_numbers" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_numbers" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_numbers" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260817192239_declarative_sync.sql`

```sql
set local check_function_bodies = off;

drop aggregate "public"."transition_sum"(integer);

create aggregate "public"."transition_sum"(integer) (
  sfunc    = public.transition_sum_state,
  stype    = integer,
  initcond = '10'
);

grant execute on function "public"."transition_sum"(integer) to public, "postgres";
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `1.0s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.4s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 214_aggregate_definition_evolution_baseline --debug`
- Result: **OK**
- Duration: `40.2s`

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
- Duration: `39.9s`
<!-- declarative-schema-command-result case="214-aggregate-definition-evolution" engine="next" command="sync" status="OK" -->

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
<!-- declarative-schema-command-result case="214-aggregate-definition-evolution" engine="next" command="sync-verification" status="OK" -->

