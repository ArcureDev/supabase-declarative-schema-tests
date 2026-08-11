select jsonb_build_object(
  'identity',
  'public.transition_anchor_246'::regclass::oid,
  'valid',
  (select count(*) = 1 and bool_and(payload = 'managed-boundary-retention')
   from public.transition_anchor_246 where case_no = 246)
  and (
    select jsonb_agg(to_jsonb(profile_row) order by profile_row.auth_user_id)
    from public.managed_profile_246 as profile_row
  ) = '[{"alias":"Boundary User","auth_user_id":"24600000-0000-0000-0000-000000000001"}]'::jsonb
  and to_regclass('public.managed_profile_alias_246_idx') is not null
  and pg_get_functiondef('public.active_auth_user_246(uuid)'::regprocedure)
      ilike '%deleted_at%'
  and not public.active_auth_user_246(
    '24600000-0000-0000-0000-000000000001'
  )
  and not has_function_privilege(
    'authenticated',
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
