create table public.all_command_notes (
  id bigint generated always as identity primary key,
  owner_id uuid not null,
  body text not null
);

alter table public.all_command_notes enable row level security;

create policy "Owners can manage all command notes"
on public.all_command_notes
for all
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());
