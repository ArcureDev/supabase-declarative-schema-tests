# Case: 193-implicit-type-widening

## Baseline state A

```sql
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.type_widening_guard (
  id bigint primary key,
  amount integer not null
);
```

## Desired state B

```sql
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.type_widening_guard (
  id bigint primary key,
  amount bigint not null
);
```

## Representative data setup

```sql
insert into public.transition_anchor values (1, 'preserved');
insert into public.type_widening_guard values (1, 2147483647);
```

## CLI-generated baseline migration files

### `20260817172004_193_implicit_type_widening_baseline.sql`

```sql
create table "public"."transition_anchor" (
  "id"      bigint not null,
  "payload" text   not null,
  constraint "transition_anchor_pkey" primary key (id)
);

create table "public"."type_widening_guard" (
  "id"     bigint  not null,
  "amount" integer not null,
  constraint "type_widening_guard_pkey" primary key (id)
);

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";

grant maintain, references, trigger, truncate on table "public"."type_widening_guard" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."type_widening_guard" to "postgres";

grant maintain, references, trigger, truncate on table "public"."type_widening_guard" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260817172104_declarative_sync.sql`

```sql
alter table "public"."type_widening_guard"
  alter column "amount" drop default;

alter table "public"."type_widening_guard"
  alter column "amount" type bigint using "amount"::bigint;
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `1.1s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.2s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 193_implicit_type_widening_baseline --debug`
- Result: **OK**
- Duration: `59.1s`

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
- Duration: `59.1s`
<!-- declarative-schema-command-result case="193-implicit-type-widening" engine="next" command="sync" status="OK" -->

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
- Duration: `50.1s`
<!-- declarative-schema-command-result case="193-implicit-type-widening" engine="next" command="sync-verification" status="OK" -->

