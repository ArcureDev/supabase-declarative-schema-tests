# Case: 197-generated-column-addition

## Baseline state A

```sql
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.generated_guard (
  id bigint primary key,
  quantity integer not null,
  unit_price numeric(10,2) not null
);
```

## Desired state B

```sql
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.generated_guard (
  id bigint primary key,
  quantity integer not null,
  unit_price numeric(10,2) not null,
  total numeric(12,2)
    generated always as (quantity * unit_price) stored
);
```

## Representative data setup

```sql
insert into public.transition_anchor values (1, 'preserved');
insert into public.generated_guard values (1, 2, 12.50);
```

## CLI-generated baseline migration files

### `20260817173240_197_generated_column_addition_baseline.sql`

```sql
create table "public"."generated_guard" (
  "id"         bigint        not null,
  "quantity"   integer       not null,
  "unit_price" numeric(10,2) not null,
  constraint "generated_guard_pkey" primary key (id)
);

create table "public"."transition_anchor" (
  "id"      bigint not null,
  "payload" text   not null,
  constraint "transition_anchor_pkey" primary key (id)
);

grant maintain, references, trigger, truncate on table "public"."generated_guard" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."generated_guard" to "postgres";

grant maintain, references, trigger, truncate on table "public"."generated_guard" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260817173321_declarative_sync.sql`

```sql
alter table "public"."generated_guard"
  add column "total" numeric(12,2) generated always as (((quantity)::numeric * unit_price)) stored;
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

- Command: `npx supabase db schema declarative sync --apply --name 197_generated_column_addition_baseline --debug`
- Result: **OK**
- Duration: `60.0s`

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
- Duration: `40.2s`
<!-- declarative-schema-command-result case="197-generated-column-addition" engine="next" command="sync" status="OK" -->

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
- Duration: `39.4s`
<!-- declarative-schema-command-result case="197-generated-column-addition" engine="next" command="sync-verification" status="OK" -->

