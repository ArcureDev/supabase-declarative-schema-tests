create schema if not exists jobs;

create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table jobs.queue (
  id bigint generated always as identity primary key,
  queue_name text not null,
  payload jsonb not null,
  status text not null default 'queued',
  available_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  attempts integer not null default 0,
  locked_at timestamptz,
  lock_owner text,
  constraint queue_status_check
    check (status in ('queued', 'retry', 'working', 'done'))
);

create index queue_claim_idx
on jobs.queue (queue_name, available_at, id)
where status in ('queued', 'retry');

create table jobs.schedules (
  name text primary key,
  cron_expression text not null,
  command_name text not null,
  enabled boolean not null default true
);

create table jobs.secret_refs (
  name text primary key,
  secret_id uuid not null
);

create table jobs.dead_letters (
  job_id bigint primary key,
  queue_name text not null,
  payload jsonb not null,
  attempts integer not null,
  failed_at timestamptz not null default now(),
  error_message text not null
);

create table jobs.worker_outbox (
  id bigint generated always as identity primary key,
  job_id bigint not null,
  event_kind text not null,
  payload jsonb not null
);

alter table jobs.queue enable row level security;
alter table jobs.queue force row level security;

create policy queue_submit
on jobs.queue
for insert
to authenticated
with check (true);

create function jobs.enqueue(
  requested_queue text,
  requested_payload jsonb
)
returns bigint
language plpgsql
security definer
set search_path = pg_catalog, jobs
as $$
declare
  queued_id bigint;
begin
  insert into jobs.queue (queue_name, payload)
  values (requested_queue, requested_payload)
  returning id into queued_id;

  return queued_id;
end
$$;

create function jobs.claim_next(
  worker_name text,
  requested_queue text
)
returns setof jobs.queue
language plpgsql
security definer
set search_path = pg_catalog, jobs
as $$
begin
  perform pg_advisory_xact_lock(
    hashtextextended(requested_queue, 242)
  );

  return query
  with candidate as (
    select queued_job.id
    from jobs.queue as queued_job
    where queued_job.queue_name = requested_queue
      and queued_job.status in ('queued', 'retry')
      and queued_job.available_at <= now()
    order by queued_job.available_at, queued_job.id
    for update skip locked
    limit 1
  )
  update jobs.queue as queued_job
  set
    status = 'working',
    locked_at = clock_timestamp(),
    lock_owner = worker_name,
    attempts = queued_job.attempts + 1
  from candidate
  where queued_job.id = candidate.id
  returning queued_job.*;
end
$$;

create function jobs.dead_letter_notify()
returns trigger
language plpgsql
set search_path = pg_catalog, jobs
as $$
begin
  insert into jobs.worker_outbox (
    job_id,
    event_kind,
    payload
  )
  values (
    new.job_id,
    'dead-letter',
    new.payload
  );

  return new;
end
$$;

create trigger dead_letter_outbox
after insert on jobs.dead_letters
for each row
execute function jobs.dead_letter_notify();

revoke all on function jobs.enqueue(text, jsonb)
from public, anon, authenticated;
revoke all on function jobs.claim_next(text, text)
from public, anon, authenticated;
grant usage on schema jobs to authenticated, service_role;
grant execute on function jobs.enqueue(text, jsonb) to authenticated;
grant execute on function jobs.claim_next(text, text) to service_role;
