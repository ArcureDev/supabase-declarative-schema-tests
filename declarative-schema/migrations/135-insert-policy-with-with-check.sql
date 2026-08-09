create table public.insertable_notes (
  id bigint generated always as identity primary key,
  owner_id uuid not null,
  body text not null
);

alter table public.insertable_notes enable row level security;

create policy "Owners can insert their notes"
on public.insertable_notes
for insert
to authenticated
with check (owner_id = auth.uid());
