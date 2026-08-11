create table public.transition_anchor_246 (
  case_no integer primary key,
  payload text not null
);

create table public.managed_profile_246 (
  auth_user_id uuid primary key,
  alias text not null
);

create table public.managed_snapshot_246 (
  id integer primary key,
  auth_users_oid oid not null,
  storage_objects_oid oid not null,
  wrapper_oid oid not null
);

create function public.active_auth_user_246(target_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from auth.users
    where id = target_id
  )
$$;

revoke execute on function public.active_auth_user_246(uuid)
from public, anon, authenticated;
grant execute on function public.active_auth_user_246(uuid)
to service_role;
