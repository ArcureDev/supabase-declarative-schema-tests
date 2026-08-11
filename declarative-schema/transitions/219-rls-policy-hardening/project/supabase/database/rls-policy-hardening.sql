create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create table public.rls_items_219 (
  id bigint generated always as identity primary key,
  tenant_id uuid not null,
  archived boolean not null default false,
  body text not null
);
alter table public.rls_items_219 enable row level security;
create policy transition_update_219
on public.rls_items_219
as permissive
for update
to authenticated
using (tenant_id = (select auth.uid()))
with check (tenant_id = (select auth.uid()));
grant select, update on table public.rls_items_219 to authenticated;
