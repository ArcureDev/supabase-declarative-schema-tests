select jsonb_build_object(
  'identity',
  'public.transition_anchor_253'::regclass::oid,
  'valid',
  (select count(*) = 1 and bool_and(payload = 'supabase-role-boundaries')
   from public.transition_anchor_253 where case_no = 253)
  and (select count(*) = 2 from public.role_boundary_253)
  and (select relrowsecurity from pg_class
       where oid = 'public.role_boundary_253'::regclass)
  and has_table_privilege('anon', 'public.role_boundary_253', 'SELECT')
  and not has_table_privilege(
    'authenticated',
    'public.role_boundary_253',
    'SELECT'
  )
  and has_function_privilege(
    'authenticated',
    'public.role_admin_marker_253()',
    'EXECUTE'
  )
  and (
    select count(*) = 4
      and bool_and(not rolsuper)
      and bool_and(
        case when rolname = 'service_role' then rolbypassrls
             else not rolbypassrls
        end
      )
    from pg_roles
    where rolname in (
      'anon',
      'authenticated',
      'service_role',
      'supabase_auth_admin'
    )
  )
)::text;
