create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create table public.auth_documents_226 (
  id bigint generated always as identity primary key,
  owner_id uuid not null,
  archived boolean not null default false,
  body text not null
);
alter table public.auth_documents_226 enable row level security;
create policy auth_owned_documents_226
on public.auth_documents_226
for all
to authenticated
using (owner_id = (select auth.uid()) and not archived)
with check (owner_id = (select auth.uid()) and not archived);
grant select, update on table public.auth_documents_226 to authenticated;
