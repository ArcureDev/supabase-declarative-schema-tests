# Case: 195-column-not-null

## Baseline state A

```sql
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.not_null_guard (
  id bigint primary key,
  note text
);
```

## Desired state B

```sql
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.not_null_guard (
  id bigint primary key,
  note text not null
);
```

## Representative data setup

```sql
insert into public.transition_anchor values (1, 'preserved');
insert into public.not_null_guard values (1, 'ready');
```

## CLI-generated baseline migration files

### `20260817172613_195_column_not_null_baseline.sql`

```sql
create table "public"."not_null_guard" (
  "id"   bigint not null,
  "note" text,
  constraint "not_null_guard_pkey" primary key (id)
);

create table "public"."transition_anchor" (
  "id"      bigint not null,
  "payload" text   not null,
  constraint "transition_anchor_pkey" primary key (id)
);

grant maintain, references, trigger, truncate on table "public"."not_null_guard" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."not_null_guard" to "postgres";

grant maintain, references, trigger, truncate on table "public"."not_null_guard" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260817172712_declarative_sync.sql`

```sql
alter table "public"."not_null_guard"
  alter column "note" set not null;
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.5s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 195_column_not_null_baseline --debug`
- Result: **OK**
- Duration: `49.6s`

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
- Duration: `59.2s`
<!-- declarative-schema-command-result case="195-column-not-null" engine="next" command="sync" status="OK" -->

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
- Duration: `50.3s`
<!-- declarative-schema-command-result case="195-column-not-null" engine="next" command="sync-verification" status="OK" -->

