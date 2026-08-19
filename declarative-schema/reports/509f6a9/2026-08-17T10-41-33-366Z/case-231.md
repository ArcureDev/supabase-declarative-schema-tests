# Case: 231-cron-job-data-boundary

## Baseline state A

```sql
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists pg_cron with schema pg_catalog;
create function public.transition_cron_task_231()
returns text
language sql
stable
set search_path = ''
as $$ select 'v1'::text $$;
```

## Desired state B

```sql
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists pg_cron with schema pg_catalog;
create function public.transition_cron_task_231()
returns text
language sql
stable
set search_path = ''
as $$ select 'v2'::text $$;
```

## Representative data setup

```sql
with scheduled_job as (
  select cron.schedule(
    'transition-231',
    '0 0 1 1 *',
    'select public.transition_cron_task_231()'
  ) as job_id
)
insert into public.transition_anchor (case_no, payload)
select
  231,
  jsonb_build_object(
    'function_oid', routine.oid,
    'function_acl', coalesce(to_jsonb(routine.proacl), 'null'::jsonb),
    'job_id', scheduled_job.job_id,
    'extension_oid', extension_catalog.oid
  )::text
from scheduled_job
cross join pg_proc as routine
cross join pg_extension as extension_catalog
where routine.oid = 'public.transition_cron_task_231()'::regprocedure
  and extension_catalog.extname = 'pg_cron';
```

## CLI-generated baseline migration files

### `20260817201145_231_cron_job_data_boundary_baseline.sql`

```sql
set local check_function_bodies = off;

create extension "pg_cron";

create table "public"."transition_anchor" (
  "case_no" integer not null,
  "payload" text    not null,
  constraint "transition_anchor_pkey" primary key (case_no)
);

create or replace function public.transition_cron_task_231()
  returns text
  language sql
  stable
  set search_path to ''
  AS $function$ select 'v1'::text $function$;

comment on extension "pg_cron" is 'Job scheduler for PostgreSQL';

grant execute on function "public"."transition_cron_task_231"() to public, "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260817201235_declarative_sync.sql`

```sql
set local check_function_bodies = off;

create or replace function public.transition_cron_task_231()
  returns text
  language sql
  stable
  set search_path to ''
  AS $function$ select 'v2'::text $function$;
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

- Command: `npx supabase db schema declarative sync --apply --name 231_cron_job_data_boundary_baseline --debug`
- Result: **OK**
- Duration: `40.4s`

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
- Duration: `49.7s`
<!-- declarative-schema-command-result case="231-cron-job-data-boundary" engine="next" command="sync" status="OK" -->

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
- Duration: `59.4s`
<!-- declarative-schema-command-result case="231-cron-job-data-boundary" engine="next" command="sync-verification" status="OK" -->

