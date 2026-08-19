# Case: 232-queue-message-data-boundary

## Baseline state A

```sql
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists pgmq;
create table public.queue_guard_232 (
  id integer primary key,
  queue_oid oid not null,
  archive_oid oid not null,
  message_id bigint not null
);
create function public.transition_queue_marker_232()
returns text
language sql
immutable
set search_path = ''
as $$ select 'v1'::text $$;
```

## Desired state B

```sql
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists pgmq;
create table public.queue_guard_232 (
  id integer primary key,
  queue_oid oid not null,
  archive_oid oid not null,
  message_id bigint not null
);
create function public.transition_queue_marker_232()
returns text
language sql
immutable
set search_path = ''
as $$ select 'v2'::text $$;
```

## Representative data setup

```sql
select pgmq.create('transition_232');
with sent as (
  select pgmq.send('transition_232', '{"case":232}'::jsonb) as message_id
)
insert into public.queue_guard_232 (id, queue_oid, archive_oid, message_id)
select
  1,
  'pgmq.q_transition_232'::regclass::oid,
  'pgmq.a_transition_232'::regclass::oid,
  sent.message_id
from sent;

insert into public.transition_anchor (case_no, payload)
select
  232,
  jsonb_build_object(
    'function_oid', routine.oid,
    'function_acl', coalesce(to_jsonb(routine.proacl), 'null'::jsonb),
    'extension_oid', extension_catalog.oid,
    'queue_acl', coalesce(to_jsonb(queue_relation.relacl), 'null'::jsonb),
    'archive_acl', coalesce(to_jsonb(archive_relation.relacl), 'null'::jsonb)
  )::text
from pg_proc as routine
cross join pg_extension as extension_catalog
cross join pg_class as queue_relation
cross join pg_class as archive_relation
where routine.oid = 'public.transition_queue_marker_232()'::regprocedure
  and extension_catalog.extname = 'pgmq'
  and queue_relation.oid = 'pgmq.q_transition_232'::regclass
  and archive_relation.oid = 'pgmq.a_transition_232'::regclass;
```

## CLI-generated baseline migration files

### `20260817201440_232_queue_message_data_boundary_baseline.sql`

```sql
set local check_function_bodies = off;

create extension "pgmq";

create table "public"."queue_guard_232" (
  "id"          integer not null,
  "queue_oid"   oid     not null,
  "archive_oid" oid     not null,
  "message_id"  bigint  not null,
  constraint "queue_guard_232_pkey" primary key (id)
);

create table "public"."transition_anchor" (
  "case_no" integer not null,
  "payload" text    not null,
  constraint "transition_anchor_pkey" primary key (case_no)
);

create or replace function public.transition_queue_marker_232()
  returns text
  language sql
  immutable
  set search_path to ''
  AS $function$ select 'v1'::text $function$;

comment on extension "pgmq" is 'A lightweight message queue. Like AWS SQS and RSMQ but on Postgres.';

grant execute on function "public"."transition_queue_marker_232"() to public, "postgres";

grant maintain, references, trigger, truncate on table "public"."queue_guard_232" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."queue_guard_232" to "postgres";

grant maintain, references, trigger, truncate on table "public"."queue_guard_232" to "service_role";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260817201521_declarative_sync.sql`

```sql
set local check_function_bodies = off;

create or replace function public.transition_queue_marker_232()
  returns text
  language sql
  immutable
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
- Duration: `21.1s`


## Establish baseline with declarative sync --apply

- Command: `npx supabase db schema declarative sync --apply --name 232_queue_message_data_boundary_baseline --debug`
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
- Duration: `39.9s`
<!-- declarative-schema-command-result case="232-queue-message-data-boundary" engine="next" command="sync" status="OK" -->

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
<!-- declarative-schema-command-result case="232-queue-message-data-boundary" engine="next" command="sync-verification" status="OK" -->

