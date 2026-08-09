create table public.updatable_notes (
  id bigint generated always as identity primary key,
  owner_id uuid not null,
  body text not null
);

alter table public.updatable_notes enable row level security;

create policy "Owners can update their notes"
on public.updatable_notes
for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());
