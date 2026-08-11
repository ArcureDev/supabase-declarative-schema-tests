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
  constraint queue_status_check
    check (status in ('queued', 'working', 'done'))
);

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

alter table jobs.queue enable row level security;

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
