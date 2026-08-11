create table public.transition_anchor_250 (
  case_no integer primary key,
  payload text not null
);

create table public.anonymous_drafts_250 (
  id bigint generated always as identity primary key,
  owner_id uuid not null,
  body text not null
);

create table public.rls_probe_250 (
  id boolean primary key default true check (id),
  visible_rows integer not null
);

alter table public.anonymous_drafts_250 enable row level security;

create policy registered_owned_drafts_250
on public.anonymous_drafts_250
for select
to authenticated
using (
  owner_id = (select auth.uid())
  and coalesce((select auth.jwt() ->> 'is_anonymous'), 'false')::boolean = false
);

grant select on table public.anonymous_drafts_250 to authenticated;
grant insert, select on table public.rls_probe_250 to authenticated;
