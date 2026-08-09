create table public.restrictive_notes (
  id bigint generated always as identity primary key,
  owner_id uuid not null,
  is_published boolean not null default false,
  body text not null
);

alter table public.restrictive_notes enable row level security;

create policy "Authenticated users can select restrictive notes"
on public.restrictive_notes
as permissive
for select
to authenticated
using (true);

create policy "Only published restrictive notes"
on public.restrictive_notes
as restrictive
for select
to authenticated
using (is_published);
