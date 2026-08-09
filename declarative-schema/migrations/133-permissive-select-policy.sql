create table public.permissive_notes (
  id bigint generated always as identity primary key,
  owner_id uuid not null,
  body text not null
);

alter table public.permissive_notes enable row level security;

create policy "Permissive owners can select"
on public.permissive_notes
as permissive
for select
to authenticated
using (owner_id = auth.uid());
