select jsonb_build_object(
  'identity',
  'public.transition_anchor_252'::regclass::oid,
  'valid',
  (select count(*) = 1 and bool_and(payload = 'auth-trigger-hardening')
   from public.transition_anchor_252 where case_no = 252)
  and (
    select display_name = 'Baseline 252'
    from public.auth_profile_252
    where user_id = '25200000-0000-0000-0000-000000000001'
  )
  and exists (
    select 1
    from pg_proc
    where oid = 'public.mirror_auth_user_252()'::regprocedure
      and prosecdef
      and array_to_string(proconfig, ',') ilike '%search_path=public%'
  )
  and not has_function_privilege(
    'authenticated',
    'public.mirror_auth_user_252()',
    'EXECUTE'
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
