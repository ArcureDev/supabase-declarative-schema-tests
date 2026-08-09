create table public.jobs (
  id bigint generated always as identity primary key,
  status text not null,
  queued_at timestamptz not null default now()
);

create index jobs_pending_queued_at_idx
on public.jobs (queued_at)
where status = 'pending';
