create table public.deletable_notes (
  id bigint generated always as identity primary key,
  owner_id uuid not null,
  body text not null
);

alter table public.deletable_notes enable row level security;

create policy "Owners can delete their notes"
on public.deletable_notes
for delete
to authenticated
using (owner_id = auth.uid());
