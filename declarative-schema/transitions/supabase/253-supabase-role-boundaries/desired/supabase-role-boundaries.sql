create table public.transition_anchor_253 (
  case_no integer primary key,
  payload text not null
);

create table public.role_boundary_253 (
  id bigint generated always as identity primary key,
  visibility text not null check (visibility in ('public', 'private')),
  body text not null
);

alter table public.role_boundary_253 enable row level security;

create policy authenticated_public_rows_253
on public.role_boundary_253
for select
to authenticated
using (visibility = 'public');

create function public.role_admin_marker_253()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select 'role-boundary-253'::text
$$;

revoke all privileges on table public.role_boundary_253 from anon;
grant select on table public.role_boundary_253 to authenticated;
grant all privileges on table public.role_boundary_253 to service_role;

revoke execute on function public.role_admin_marker_253()
from public, anon, authenticated, service_role;
grant execute on function public.role_admin_marker_253()
to supabase_auth_admin;
