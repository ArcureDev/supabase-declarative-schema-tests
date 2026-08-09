create schema fixture_policy_helpers;

create table public.helper_guarded_notes (
  id bigint generated always as identity primary key,
  owner_id uuid not null,
  body text not null
);

create function fixture_policy_helpers.is_owner(candidate uuid)
returns boolean
language sql
stable
security definer
set search_path = fixture_policy_helpers
as $$
  select candidate = auth.uid();
$$;

alter table public.helper_guarded_notes enable row level security;

create policy "Owners can select helper guarded notes"
on public.helper_guarded_notes
for select
to authenticated
using (fixture_policy_helpers.is_owner(owner_id));
