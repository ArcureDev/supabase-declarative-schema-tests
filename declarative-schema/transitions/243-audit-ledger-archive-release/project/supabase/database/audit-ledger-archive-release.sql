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
