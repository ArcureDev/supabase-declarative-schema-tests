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
