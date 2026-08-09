create table public.multi_role_notes (
  id bigint generated always as identity primary key,
  body text not null
);

alter table public.multi_role_notes enable row level security;

create policy "Anon and authenticated can select multi role notes"
on public.multi_role_notes
for select
to anon, authenticated
using (true);
