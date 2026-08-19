# Case: 224-fdw-option-redaction

## Baseline state A

```sql
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists postgres_fdw;
create server transition_server_224
  foreign data wrapper postgres_fdw
  options (host 'alpha.invalid', dbname 'postgres', port '5432');
create user mapping for current_user
  server transition_server_224
  options (user 'postgres');
```

## Desired state B

```sql
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists postgres_fdw;
create server transition_server_224
  foreign data wrapper postgres_fdw
  options (host 'beta.invalid', dbname 'postgres', port '5432');
create user mapping for current_user
  server transition_server_224
  options (user 'postgres');
```

## Representative data setup

```sql
insert into public.transition_anchor (case_no, payload)
values (224, 'case-224');

alter user mapping for current_user
  server transition_server_224
  options (add password '[REDACTED]');
```

## CLI-generated baseline migration files

### `20260817194751_224_fdw_option_redaction_baseline.sql`

```sql
set local check_function_bodies = off;

create extension "postgres_fdw" schema "public";

create server "transition_server_224"
  foreign data wrapper "postgres_fdw"
  options (
    "dbname" 'postgres',
    "host" 'alpha.invalid',
    "port" '5432'
  );

create table "public"."transition_anchor" (
  "case_no" integer not null,
  "payload" text    not null,
  constraint "transition_anchor_pkey" primary key (case_no)
);

create user mapping for "postgres" server "transition_server_224" options ("user" 'postgres');

comment on extension "postgres_fdw" is 'foreign-data wrapper for remote PostgreSQL servers';

grant usage on foreign server "transition_server_224" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260817194831_declarative_sync.sql`

```sql
alter server "transition_server_224"
  options (SET "host" 'beta.invalid');
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.9s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `21.3s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 224_fdw_option_redaction_baseline --debug`
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
- Duration: `40.1s`
<!-- declarative-schema-command-result case="224-fdw-option-redaction" engine="next" command="sync" status="OK" -->

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
- Duration: `39.5s`
<!-- declarative-schema-command-result case="224-fdw-option-redaction" engine="next" command="sync-verification" status="OK" -->

