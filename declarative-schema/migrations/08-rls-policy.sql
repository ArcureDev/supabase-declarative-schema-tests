create table public.private_notes (
  id bigint generated always as identity primary key,
  owner_id uuid not null,
  body text not null
);

alter table public.private_notes enable row level security;

create policy "Authenticated users can read their notes"
on public.private_notes
for select
to authenticated
using (owner_id = auth.uid());
