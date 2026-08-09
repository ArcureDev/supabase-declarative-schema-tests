create table public.auth_uid_notes (
  id bigint generated always as identity primary key,
  owner_id uuid not null,
  body text not null
);

alter table public.auth_uid_notes enable row level security;

create policy "Users can select notes by auth uid"
on public.auth_uid_notes
for select
to authenticated
using (owner_id = auth.uid());
