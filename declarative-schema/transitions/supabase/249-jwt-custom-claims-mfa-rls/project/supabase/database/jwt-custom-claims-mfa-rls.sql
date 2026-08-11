create table public.transition_anchor_249 (
  case_no integer primary key,
  payload text not null
);

create table public.protected_records_249 (
  id bigint generated always as identity primary key,
  owner_id uuid not null,
  tenant_id text not null,
  body text not null
);

create table public.rls_probe_249 (
  label text primary key,
  visible_rows integer not null
);

alter table public.protected_records_249 enable row level security;

create policy jwt_tenant_records_249
on public.protected_records_249
for select
to authenticated
using (
  owner_id = (select auth.uid())
  and tenant_id = (select auth.jwt() -> 'app_metadata' ->> 'tenant_id')
);

grant select on table public.protected_records_249 to authenticated;
grant insert, select on table public.rls_probe_249 to authenticated;
