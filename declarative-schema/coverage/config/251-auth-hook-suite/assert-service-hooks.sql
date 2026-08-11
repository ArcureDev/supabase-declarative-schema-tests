do $$
declare
  service_user_id uuid;
begin
  select id
  into service_user_id
  from auth.users
  where email = 'hook-user-251@example.test';

  if service_user_id is null then
    raise exception 'local Auth signup did not create hook user 251';
  end if;

  if not exists (
    select 1
    from public.auth_hook_audit_251
    where hook_name = 'custom_access_token'
      and event #>> '{claims,email}' = 'hook-user-251@example.test'
  ) then
    raise exception 'configured custom access token hook was not invoked';
  end if;

  if not exists (
    select 1
    from public.auth_hook_audit_251
    where hook_name = 'password_verification_attempt'
      and event ->> 'user_id' = service_user_id::text
  ) then
    raise exception 'configured password verification hook was not invoked';
  end if;

  if exists (
    select 1
    from pg_proc
    where oid in (
      'public.hook_access_token_251(jsonb)'::regprocedure,
      'public.hook_mfa_attempt_251(jsonb)'::regprocedure,
      'public.hook_password_attempt_251(jsonb)'::regprocedure,
      'public.hook_send_sms_251(jsonb)'::regprocedure
    )
      and (
        pg_get_userbyid(proowner) <> 'postgres'
        or not prosecdef
        or array_to_string(proconfig, ',') not ilike '%search_path=%'
      )
  ) then
    raise exception 'Auth hook ownership or hardened execution context drifted';
  end if;
end
$$;
