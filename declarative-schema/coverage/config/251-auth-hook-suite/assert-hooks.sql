do $$
declare
  access_result jsonb;
  mfa_result jsonb;
  password_result jsonb;
begin
  access_result := public.hook_access_token_251(
    '{"claims":{"sub":"25100000-0000-0000-0000-000000000001"}}'::jsonb
  );
  mfa_result := public.hook_mfa_attempt_251(
    '{"user_id":"25100000-0000-0000-0000-000000000001","factor_id":"25100000-0000-0000-0000-000000000002","valid":true}'::jsonb
  );
  password_result := public.hook_password_attempt_251(
    '{"user_id":"25100000-0000-0000-0000-000000000001","valid":true}'::jsonb
  );
  perform public.hook_send_sms_251(
    '{"user":{"id":"25100000-0000-0000-0000-000000000001","phone":"+15552510000"},"sms":{"otp":"000000"}}'::jsonb
  );

  if access_result #>> '{claims,hook_case}' <> 'case-251' then
    raise exception 'custom access token hook did not add hook_case';
  end if;
  if mfa_result ->> 'decision' <> 'continue'
      or password_result ->> 'decision' <> 'continue' then
    raise exception 'Auth decision hook returned an invalid contract';
  end if;
  if (
    select count(distinct hook_name)
    from public.auth_hook_audit_251
  ) <> 4 then
    raise exception 'not every Auth hook recorded its direct probe';
  end if;
end
$$;

do $$
declare
  signature regprocedure;
begin
  foreach signature in array array[
    'public.hook_access_token_251(jsonb)'::regprocedure,
    'public.hook_mfa_attempt_251(jsonb)'::regprocedure,
    'public.hook_password_attempt_251(jsonb)'::regprocedure,
    'public.hook_send_sms_251(jsonb)'::regprocedure
  ] loop
    if not has_function_privilege(
      'supabase_auth_admin',
      signature,
      'EXECUTE'
    ) then
      raise exception 'supabase_auth_admin lacks hook execute privilege';
    end if;
    if has_function_privilege('anon', signature, 'EXECUTE')
        or has_function_privilege('authenticated', signature, 'EXECUTE') then
      raise exception 'client role can execute protected Auth hook';
    end if;
  end loop;
end
$$;
