# Case: 297-managed-database-webhook-trigger

## Baseline state A

```sql
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create table public.database_webhook_events_297 (
  id bigint generated always as identity primary key,
  payload jsonb not null
);
```

## Desired state B

```sql
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create table public.database_webhook_events_297 (
  id bigint generated always as identity primary key,
  payload jsonb not null
);

create trigger database_webhook_297
after insert or update on public.database_webhook_events_297
for each row
execute function supabase_functions.http_request(
  'http://127.0.0.1:1/database-webhook-297',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);
```

## Representative data setup

```sql
insert into public.transition_anchor (case_no, payload)
values (
  297,
  jsonb_build_object(
    'table_oid', 'public.database_webhook_events_297'::regclass::oid,
    'function_oid', 'supabase_functions.http_request()'::regprocedure::oid
  )::text
);

insert into public.database_webhook_events_297 (payload)
values ('{"state":"preserved"}');
```

## CLI-generated baseline migration files

### `20260818014337_297_managed_database_webhook_trigger_baseline.sql`

```sql
create table "public"."database_webhook_events_297" (
  "id"      bigint generated always as identity not null,
  "payload" jsonb  not null,
  constraint "database_webhook_events_297_pkey" primary key (id)
);

create table "public"."transition_anchor" (
  "case_no" integer not null,
  "payload" text    not null,
  constraint "transition_anchor_pkey" primary key (case_no)
);

grant maintain, references, trigger, truncate on table "public"."database_webhook_events_297" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."database_webhook_events_297" to "postgres";

grant maintain, references, trigger, truncate on table "public"."database_webhook_events_297" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260818014417_declarative_sync.sql`

```sql
create trigger database_webhook_297
  after insert or update on public.database_webhook_events_297
  for each row
  execute function supabase_functions.http_request('http://127.0.0.1:1/database-webhook-297', 'POST', '{"Content-Type":"application/json"}', '{}', '1000');
```


## Start local runtime

- Command: `npx supabase start --debug`
- Result: **OK**
- Duration: `0.7s`

## Clear local runtime before baseline

- Command: `npx supabase db reset --local --no-seed --debug`
- Result: **OK**
- Duration: `32.5s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 297_managed_database_webhook_trigger_baseline --debug`
- Result: **OK**
- Duration: `50.8s`

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
- Duration: `40.5s`
<!-- declarative-schema-command-result case="297-managed-database-webhook-trigger" engine="next" command="sync" status="OK" -->

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
- Duration: `49.6s`
<!-- declarative-schema-command-result case="297-managed-database-webhook-trigger" engine="next" command="sync-verification" status="OK" -->

