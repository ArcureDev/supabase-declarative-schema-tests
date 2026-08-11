begin;

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
)
values (
  '00000000-0000-0000-0000-000000000000',
  '25200000-0000-0000-0000-000000000002',
  'authenticated',
  'authenticated',
  'hardened-252@example.test',
  '',
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"display_name":"Hardened 252"}'::jsonb,
  now(),
  now(),
  '',
  '',
  '',
  ''
);

do $$
declare
  rejected boolean := false;
begin
  begin
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token
    )
    values (
      '00000000-0000-0000-0000-000000000000',
      '25200000-0000-0000-0000-000000000003',
      'authenticated',
      'authenticated',
      'rejected-252@example.test',
      '',
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{}'::jsonb,
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
  exception when check_violation then
    rejected := true;
  end;

  if not rejected then
    raise exception 'auth trigger 252 accepted missing display_name';
  end if;
end
$$;

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
)
values (
  '00000000-0000-0000-0000-000000000000',
  '25200000-0000-0000-0000-000000000004',
  'authenticated',
  'authenticated',
  'cascade-252@example.test',
  '',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"display_name":"Cascade 252"}'::jsonb,
  now(),
  now(),
  '',
  '',
  '',
  ''
);
delete from auth.users where id = '25200000-0000-0000-0000-000000000004';

select jsonb_build_object(
  'identity',
  'public.transition_anchor_252'::regclass::oid,
  'valid',
  (select count(*) = 1 and bool_and(payload = 'auth-trigger-hardening')
   from public.transition_anchor_252 where case_no = 252)
  and exists (
    select 1 from public.auth_profile_252
    where user_id = '25200000-0000-0000-0000-000000000001'
      and display_name = 'Baseline 252'
  )
  and exists (
    select 1 from public.auth_profile_252
    where user_id = '25200000-0000-0000-0000-000000000002'
      and display_name = 'Hardened 252'
  )
  and not exists (
    select 1 from auth.users
    where id = '25200000-0000-0000-0000-000000000003'
  )
  and not exists (
    select 1 from public.auth_profile_252
    where user_id = '25200000-0000-0000-0000-000000000004'
  )
  and exists (
    select 1
    from pg_proc
    where oid = 'public.mirror_auth_user_252()'::regprocedure
      and prosecdef
      and array_to_string(proconfig, ',') ilike '%search_path=%'
      and pg_get_functiondef(oid) ilike '%public.auth_profile_252%'
  )
  and (
    select snapshot.function_oid =
        'public.mirror_auth_user_252()'::regprocedure::oid
      and snapshot.trigger_oid = trigger_state.oid
    from public.auth_trigger_snapshot_252 as snapshot
    join pg_trigger as trigger_state
      on trigger_state.tgrelid = 'auth.users'::regclass
     and trigger_state.tgname = 'auth_profile_mirror_252'
     and not trigger_state.tgisinternal
    where snapshot.id = 1
  )
)::text;
rollback;
