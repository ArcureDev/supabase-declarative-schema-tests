create table public.auth_hook_audit_251 (
  id bigint generated always as identity primary key,
  hook_name text not null,
  event jsonb not null,
  invoked_at timestamptz not null default now()
);

revoke all on table public.auth_hook_audit_251
from public, anon, authenticated;
grant select on table public.auth_hook_audit_251
to supabase_auth_admin;

create function public.hook_access_token_251(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  claims jsonb := coalesce(event -> 'claims', '{}'::jsonb);
begin
  insert into public.auth_hook_audit_251 (hook_name, event)
  values ('custom_access_token', event);
  claims := jsonb_set(claims, '{hook_case}', '"case-251"', true);
  return jsonb_build_object('claims', claims);
end
$$;

create function public.hook_mfa_attempt_251(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.auth_hook_audit_251 (hook_name, event)
  values ('mfa_verification_attempt', event);
  return jsonb_build_object('decision', 'continue');
end
$$;

create function public.hook_password_attempt_251(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.auth_hook_audit_251 (hook_name, event)
  values ('password_verification_attempt', event);
  return jsonb_build_object('decision', 'continue');
end
$$;

create function public.hook_send_sms_251(event jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.auth_hook_audit_251 (hook_name, event)
  values ('send_sms', event);
end
$$;

revoke execute on function public.hook_access_token_251(jsonb)
from public, anon, authenticated;
revoke execute on function public.hook_mfa_attempt_251(jsonb)
from public, anon, authenticated;
revoke execute on function public.hook_password_attempt_251(jsonb)
from public, anon, authenticated;
revoke execute on function public.hook_send_sms_251(jsonb)
from public, anon, authenticated;

grant execute on function public.hook_access_token_251(jsonb)
to supabase_auth_admin;
grant execute on function public.hook_mfa_attempt_251(jsonb)
to supabase_auth_admin;
grant execute on function public.hook_password_attempt_251(jsonb)
to supabase_auth_admin;
grant execute on function public.hook_send_sms_251(jsonb)
to supabase_auth_admin;
