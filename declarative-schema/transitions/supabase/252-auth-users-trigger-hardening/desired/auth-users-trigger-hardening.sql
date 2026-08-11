create table public.transition_anchor_252 (
  case_no integer primary key,
  payload text not null
);

create table public.auth_profile_252 (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);

create table public.auth_trigger_snapshot_252 (
  id integer primary key,
  function_oid oid not null,
  trigger_oid oid not null
);

create function public.mirror_auth_user_252()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_name text := nullif(
    btrim(new.raw_user_meta_data ->> 'display_name'),
    ''
  );
begin
  if requested_name is null then
    raise check_violation using
      message = 'display_name is required for auth profile 252';
  end if;

  insert into public.auth_profile_252 (user_id, display_name)
  values (new.id, requested_name);
  return new;
end
$$;

revoke execute on function public.mirror_auth_user_252()
from public, anon, authenticated;
grant execute on function public.mirror_auth_user_252()
to supabase_auth_admin;

create trigger auth_profile_mirror_252
after insert on auth.users
for each row
execute function public.mirror_auth_user_252();
