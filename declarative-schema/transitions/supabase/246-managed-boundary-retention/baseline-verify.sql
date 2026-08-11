select jsonb_build_object(
  'identity',
  'public.transition_anchor_246'::regclass::oid,
  'valid',
  (select count(*) = 1 and bool_and(payload = 'managed-boundary-retention')
   from public.transition_anchor_246 where case_no = 246)
  and (select count(*) = 1 from public.managed_profile_246)
  and to_regclass('public.managed_profile_alias_246_idx') is null
  and pg_get_functiondef('public.active_auth_user_246(uuid)'::regprocedure)
      not ilike '%deleted_at%'
  and not has_function_privilege(
    'anon',
    'public.active_auth_user_246(uuid)',
    'EXECUTE'
  )
  and has_function_privilege(
    'service_role',
    'public.active_auth_user_246(uuid)',
    'EXECUTE'
  )
  and (
    select auth_users_oid = 'auth.users'::regclass::oid
      and storage_objects_oid = 'storage.objects'::regclass::oid
      and wrapper_oid = 'public.active_auth_user_246(uuid)'::regprocedure::oid
    from public.managed_snapshot_246
    where id = 1
  )
)::text;
