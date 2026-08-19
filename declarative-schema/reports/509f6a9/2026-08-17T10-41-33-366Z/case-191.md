# Case: 191-table-storage-parameters

## Baseline state A

```sql
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.storage_parameter_guard (
  id bigint primary key,
  payload text not null
);
```

## Desired state B

```sql
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.storage_parameter_guard (
  id bigint primary key,
  payload text not null
) with (fillfactor = 70);
```

## Representative data setup

```sql
insert into public.transition_anchor values (1, 'preserved');
insert into public.storage_parameter_guard values (1, 'existing');
```

## CLI-generated baseline migration files

### `20260817171431_191_table_storage_parameters_baseline.sql`

```sql
create table "public"."storage_parameter_guard" (
  "id"      bigint not null,
  "payload" text   not null,
  constraint "storage_parameter_guard_pkey" primary key (id)
);

create table "public"."transition_anchor" (
  "id"      bigint not null,
  "payload" text   not null,
  constraint "transition_anchor_pkey" primary key (id)
);

grant maintain, references, trigger, truncate on table "public"."storage_parameter_guard" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."storage_parameter_guard" to "postgres";

grant maintain, references, trigger, truncate on table "public"."storage_parameter_guard" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260817171511_declarative_sync.sql`

```sql
alter table "public"."storage_parameter_guard"
  set (fillfactor=70);
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.6s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 191_table_storage_parameters_baseline --debug`
- Result: **OK**
- Duration: `39.9s`

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
- Duration: `39.7s`
<!-- declarative-schema-command-result case="191-table-storage-parameters" engine="next" command="sync" status="OK" -->

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
- Duration: `39.3s`
<!-- declarative-schema-command-result case="191-table-storage-parameters" engine="next" command="sync-verification" status="OK" -->

