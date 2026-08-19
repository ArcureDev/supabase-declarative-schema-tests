# Case: 243-audit-ledger-archive-release

## Baseline state A

```sql
create schema if not exists extensions;
create schema if not exists audit;

create extension if not exists pgcrypto
with schema extensions;

create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table audit.ledger (
  id bigint generated always as identity,
  occurred_on date not null,
  actor text not null,
  payload jsonb not null,
  previous_hash bytea,
  entry_hash bytea not null,
  primary key (occurred_on, id)
)
partition by range (occurred_on);

create table audit.ledger_2026_08
partition of audit.ledger
for values from ('2026-08-01') to ('2026-09-01');

create function audit.reject_ledger_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'audit ledger is append-only';
end
$$;

create trigger ledger_append_only
before update or delete on audit.ledger
for each row
execute function audit.reject_ledger_mutation();

create function audit.append_event(
  event_date date,
  event_actor text,
  event_payload jsonb
)
returns bigint
language plpgsql
security definer
set search_path = pg_catalog, audit, extensions
as $$
declare
  prior bytea;
  inserted_id bigint;
begin
  select ledger_row.entry_hash
  into prior
  from audit.ledger as ledger_row
  order by ledger_row.occurred_on desc, ledger_row.id desc
  limit 1;

  insert into audit.ledger (
    occurred_on,
    actor,
    payload,
    previous_hash,
    entry_hash
  )
  values (
    event_date,
    event_actor,
    event_payload,
    prior,
    extensions.digest(
      coalesce(prior, '\x'::bytea)
        || convert_to(event_payload::text, 'UTF8'),
      'sha256'
    )
  )
  returning id into inserted_id;

  return inserted_id;
end
$$;

revoke all on audit.ledger from public, anon, authenticated;
grant usage on schema audit to authenticated;
grant execute
on function audit.append_event(date, text, jsonb)
to authenticated;
```

## Desired state B

```sql
create schema if not exists extensions;
create schema if not exists audit;

create extension if not exists pgcrypto
with schema extensions;

create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table audit.ledger (
  id bigint generated always as identity,
  occurred_on date not null,
  actor text not null,
  payload jsonb not null,
  previous_hash bytea,
  entry_hash bytea not null,
  source text not null default 'api',
  request_id uuid not null default gen_random_uuid(),
  primary key (occurred_on, id)
)
partition by range (occurred_on);

create table audit.ledger_2026_08
partition of audit.ledger
for values from ('2026-08-01') to ('2026-09-01');

create table audit.ledger_2026_09
partition of audit.ledger
for values from ('2026-09-01') to ('2026-10-01');

create index ledger_actor_time_idx
on audit.ledger (actor, occurred_on desc, id desc);

create function audit.reject_ledger_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'audit ledger is append-only';
end
$$;

create trigger ledger_append_only
before update or delete on audit.ledger
for each row
execute function audit.reject_ledger_mutation();

create function audit.append_event(
  event_date date,
  event_actor text,
  event_payload jsonb
)
returns bigint
language plpgsql
security definer
set search_path = pg_catalog, audit, extensions
as $$
declare
  prior bytea;
  inserted_id bigint;
  normalized_payload jsonb;
  event_request_id uuid;
begin
  normalized_payload := jsonb_strip_nulls(event_payload);
  event_request_id := gen_random_uuid();
  perform pg_advisory_xact_lock(hashtextextended('audit.ledger', 243));

  select ledger_row.entry_hash
  into prior
  from audit.ledger as ledger_row
  order by ledger_row.occurred_on desc, ledger_row.id desc
  limit 1;

  insert into audit.ledger (
    occurred_on,
    actor,
    source,
    request_id,
    payload,
    previous_hash,
    entry_hash
  )
  values (
    event_date,
    event_actor,
    'api',
    event_request_id,
    normalized_payload,
    prior,
    extensions.digest(
      coalesce(prior, '\x'::bytea)
        || convert_to(event_date::text, 'UTF8')
        || convert_to(event_actor, 'UTF8')
        || convert_to('api', 'UTF8')
        || convert_to(event_request_id::text, 'UTF8')
        || convert_to(normalized_payload::text, 'UTF8'),
      'sha256'
    )
  )
  returning id into inserted_id;

  return inserted_id;
end
$$;

create view audit.audit_feed
with (security_barrier = true)
as
select
  occurred_on,
  id,
  actor,
  source,
  request_id,
  payload,
  entry_hash
from audit.ledger;

create function audit.record_ddl_boundary()
returns event_trigger
language plpgsql
as $$
begin
  null;
end
$$;

create event trigger ds_243_ddl_boundary
on ddl_command_end
when tag in ('ALTER TABLE', 'CREATE INDEX')
execute function audit.record_ddl_boundary();

create foreign data wrapper ds_243_archive_fdw;

create server ds_243_archive_server
foreign data wrapper ds_243_archive_fdw;

create foreign table audit.archived_ledger (
  occurred_on date,
  id bigint,
  actor text,
  payload jsonb,
  entry_hash bytea
)
server ds_243_archive_server;

create table audit.retention_manifest (
  partition_name text primary key,
  archive_after date not null,
  archived boolean not null default false
);

revoke all on audit.ledger from public, anon, authenticated;
revoke all on function audit.append_event(date, text, jsonb)
from public, anon;
grant usage on schema audit to authenticated;
grant execute
on function audit.append_event(date, text, jsonb)
to authenticated;
grant select on audit.audit_feed to authenticated;
```

## Representative data setup

```sql
insert into public.transition_anchor (id, payload)
values (243, 'audit-ledger');

select audit.append_event(
  '2026-08-10',
  'alice',
  '{"action":"create"}'::jsonb
);

select audit.append_event(
  '2026-08-11',
  'bob',
  '{"action":"approve"}'::jsonb
);
```

## CLI-generated baseline migration files

### `20260817214852_243_audit_ledger_archive_release_baseline.sql`

```sql
set local check_function_bodies = off;

create schema "audit";

create table "audit"."ledger" (
  "id"            bigint generated always as identity not null,
  "occurred_on"   date   not null,
  "actor"         text   not null,
  "payload"       jsonb  not null,
  "previous_hash" bytea,
  "entry_hash"    bytea  not null
) partition by range (occurred_on);

create table "audit"."ledger_2026_08" partition of "audit"."ledger" for values from ('2026-08-01') to ('2026-09-01');

create table "public"."transition_anchor" (
  "id"      bigint not null,
  "payload" text   not null,
  constraint "transition_anchor_pkey" primary key (id)
);

create or replace function audit.append_event (
  event_date    date,
  event_actor   text,
  event_payload jsonb
)
  returns bigint
  language plpgsql
  security definer
  set search_path to 'pg_catalog', 'audit', 'extensions'
  AS $function$
declare
  prior bytea;
  inserted_id bigint;
begin
  select ledger_row.entry_hash
  into prior
  from audit.ledger as ledger_row
  order by ledger_row.occurred_on desc, ledger_row.id desc
  limit 1;

  insert into audit.ledger (
    occurred_on,
    actor,
    payload,
    previous_hash,
    entry_hash
  )
  values (
    event_date,
    event_actor,
    event_payload,
    prior,
    extensions.digest(
      coalesce(prior, '\x'::bytea)
        || convert_to(event_payload::text, 'UTF8'),
      'sha256'
    )
  )
  returning id into inserted_id;

  return inserted_id;
end
$function$;

create or replace function audit.reject_ledger_mutation()
  returns trigger
  language plpgsql
  AS $function$
begin
  raise exception 'audit ledger is append-only';
end
$function$;

alter table "audit"."ledger"
  add constraint "ledger_pkey" primary key (occurred_on, id);

create trigger ledger_append_only
  before delete or update on audit.ledger
  for each row
  execute function audit.reject_ledger_mutation();

grant execute on function "audit"."append_event"(date, text, jsonb) to "authenticated", "postgres";

grant execute on function "audit"."reject_ledger_mutation"() to "postgres";

grant usage on schema "audit" to "authenticated";

grant create, usage on schema "audit" to "postgres";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "audit"."ledger" to "postgres";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "audit"."ledger_2026_08" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."transition_anchor" to "postgres";

grant maintain, references, trigger, truncate on table "public"."transition_anchor" to "service_role";
```


## Declared migration-shape assertion

- Raw sync result: **OK**
- Assertion: **OK**
- The generated migration matched every required SQL shape and no forbidden shape.

## Generated transition migration files

### `20260817214932_declarative_sync.sql`

```sql
set local check_function_bodies = off;

create foreign data wrapper "ds_243_archive_fdw";

create server "ds_243_archive_server"
  foreign data wrapper "ds_243_archive_fdw";

create table "audit"."ledger_2026_09" partition of "audit"."ledger" for values from ('2026-09-01') to ('2026-10-01');

create table "audit"."retention_manifest" (
  "partition_name" text    not null,
  "archive_after"  date    not null,
  "archived"       boolean not null default false,
  constraint "retention_manifest_pkey" primary key (partition_name)
);

alter table "audit"."ledger"
  add column "source" text not null default 'api'::text;

alter table "audit"."ledger"
  add column "request_id" uuid not null default gen_random_uuid();

create foreign table "audit"."archived_ledger" () server "ds_243_archive_server";

alter table "audit"."archived_ledger"
  add column "occurred_on" date;

alter table "audit"."archived_ledger"
  add column "id" bigint;

alter table "audit"."archived_ledger"
  add column "actor" text;

alter table "audit"."archived_ledger"
  add column "payload" jsonb;

alter table "audit"."archived_ledger"
  add column "entry_hash" bytea;

create or replace function audit.append_event (
  event_date    date,
  event_actor   text,
  event_payload jsonb
)
  returns bigint
  language plpgsql
  security definer
  set search_path to 'pg_catalog', 'audit', 'extensions'
  AS $function$
declare
  prior bytea;
  inserted_id bigint;
  normalized_payload jsonb;
  event_request_id uuid;
begin
  normalized_payload := jsonb_strip_nulls(event_payload);
  event_request_id := gen_random_uuid();
  perform pg_advisory_xact_lock(hashtextextended('audit.ledger', 243));

  select ledger_row.entry_hash
  into prior
  from audit.ledger as ledger_row
  order by ledger_row.occurred_on desc, ledger_row.id desc
  limit 1;

  insert into audit.ledger (
    occurred_on,
    actor,
    source,
    request_id,
    payload,
    previous_hash,
    entry_hash
  )
  values (
    event_date,
    event_actor,
    'api',
    event_request_id,
    normalized_payload,
    prior,
    extensions.digest(
      coalesce(prior, '\x'::bytea)
        || convert_to(event_date::text, 'UTF8')
        || convert_to(event_actor, 'UTF8')
        || convert_to('api', 'UTF8')
        || convert_to(event_request_id::text, 'UTF8')
        || convert_to(normalized_payload::text, 'UTF8'),
      'sha256'
    )
  )
  returning id into inserted_id;

  return inserted_id;
end
$function$;

create or replace function audit.record_ddl_boundary()
  returns event_trigger
  language plpgsql
  AS $function$
begin
  null;
end
$function$;

create view "audit"."audit_feed" with (security_barrier=true) AS  SELECT occurred_on,
    id,
    actor,
    source,
    request_id,
    payload,
    entry_hash
   FROM audit.ledger;

create index ledger_actor_time_idx on only audit.ledger using btree (actor, occurred_on desc, id desc);

create event trigger "ds_243_ddl_boundary"
  on ddl_command_end
  when tag in ('ALTER TABLE', 'CREATE INDEX')
  execute function "audit"."record_ddl_boundary"();

grant delete, insert, maintain, references, select, trigger, truncate, update on table "audit"."archived_ledger" to "postgres";

revoke all on function "audit"."append_event"(date, text, jsonb) from public;

grant execute on function "audit"."record_ddl_boundary"() to "postgres";

grant usage on foreign server "ds_243_archive_server" to "postgres";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "audit"."ledger_2026_09" to "postgres";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "audit"."retention_manifest" to "postgres";

grant select on table "audit"."audit_feed" to "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "audit"."audit_feed" to "postgres";
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

- Command: `npx supabase db schema declarative sync --apply --name 243_audit_ledger_archive_release_baseline --debug`
- Result: **OK**
- Duration: `40.3s`

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
<!-- declarative-schema-command-result case="243-audit-ledger-archive-release" engine="next" command="sync" status="OK" -->

## Apply generated transition migration

- Command: `npx supabase migration up --local --debug`
- Result: **OK**
- Duration: `0.6s`

## Verify desired state B

- Command: `docker exec --interactive supabase_db_ds-shared-runtime psql --username postgres --dbname postgres --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --file -`
- Result: **OK**
- Duration: `0.1s`

## Sync verification / convergence (pg-delta next)

- Command: `npx supabase db schema declarative sync --no-apply --debug`
- Result: **OK**
- Duration: `59.4s`
<!-- declarative-schema-command-result case="243-audit-ledger-archive-release" engine="next" command="sync-verification" status="OK" -->

