# Case: 200-data-shape-preservation

## Baseline state A

```sql
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.data_shape_guard (
  id bigint primary key,
  nullable_text text,
  tags text[] not null,
  document jsonb not null,
  bytes bytea not null,
  large_text text not null,
  amount numeric(20,4) not null,
  happened_at timestamptz not null
);
```

## Desired state B

```sql
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.data_shape_guard (
  id bigint primary key,
  nullable_text text,
  tags text[] not null,
  document jsonb not null,
  bytes bytea not null,
  large_text text not null,
  amount numeric(20,4) not null,
  happened_at timestamptz not null,
  shape_version smallint not null default 1
);
```

## Representative data setup

```sql
insert into public.transition_anchor values (1, 'preserved');

insert into public.data_shape_guard values (
  1,
  null,
  array['α', 'comma,value', null]::text[],
  '{"nested":{"ok":true},"n":123.4500}'::jsonb,
  decode('00ff10', 'hex'),
  repeat('x', 10000),
  9999999999999999.9999,
  timestamptz '2024-02-29 23:59:59.123456+00'
);
```

## CLI-generated baseline migration files

### `20260817174105_200_data_shape_preservation_baseline.sql`

```sql
create table "public"."data_shape_guard" (
  "id"            bigint                   not null,
  "nullable_text" text,
  "tags"          text[]                   not null,
  "document"      jsonb                    not null,
  "bytes"         bytea                    not null,
  "large_text"    text                     not null,
  "amount"        numeric(20,4)            not null,
  "happened_at"   timestamp with time zone not null,
  constraint "data_shape_guard_pkey" primary key (id)
);

create table "public"."transition_anchor" (
  "id"      bigint not null,
  "payload" text   not null,
  constraint "transition_anchor_pkey" primary key (id)
);

grant maintain, references, trigger, truncate on table "public"."data_shape_guard" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."data_shape_guard" to "postgres";

grant maintain, references, trigger, truncate on table "public"."data_shape_guard" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260817174204_declarative_sync.sql`

```sql
alter table "public"."data_shape_guard"
  add column "shape_version" smallint not null default 1;
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `1.0s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.2s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 200_data_shape_preservation_baseline --debug`
- Result: **OK**
- Duration: `59.6s`

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
- Duration: `58.9s`
<!-- declarative-schema-command-result case="200-data-shape-preservation" engine="next" command="sync" status="OK" -->

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
- Duration: `40.1s`
<!-- declarative-schema-command-result case="200-data-shape-preservation" engine="next" command="sync-verification" status="OK" -->

