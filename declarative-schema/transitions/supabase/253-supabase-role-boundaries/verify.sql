select jsonb_build_object(
  'identity',
  'public.transition_anchor_253'::regclass::oid,
  'valid',
  (select count(*) = 1 and bool_and(payload = 'supabase-role-boundaries')
   from public.transition_anchor_253 where case_no = 253)
  and (select count(*) = 2 from public.role_boundary_253)
  and (select relrowsecurity from pg_class
       where oid = 'public.role_boundary_253'::regclass)
  and not has_table_privilege('anon', 'public.role_boundary_253', 'SELECT')
  and has_table_privilege(
    'authenticated',
    'public.role_boundary_253',
    'SELECT'
  )
  and not has_table_privilege(
    'authenticated',
    'public.role_boundary_253',
    'UPDATE'
  )
  and has_table_privilege('service_role', 'public.role_boundary_253', 'SELECT')
  and has_table_privilege('service_role', 'public.role_boundary_253', 'INSERT')
  and has_table_privilege('service_role', 'public.role_boundary_253', 'UPDATE')
  and has_table_privilege('service_role', 'public.role_boundary_253', 'DELETE')
  and has_function_privilege(
    'supabase_auth_admin',
    'public.role_admin_marker_253()',
    'EXECUTE'
  )
  and not has_function_privilege(
    'authenticated',
    'public.role_admin_marker_253()',
    'EXECUTE'
  )
  and not has_function_privilege(
    'service_role',
    'public.role_admin_marker_253()',
    'EXECUTE'
  )
  and exists (
    select 1
    from pg_policy
    where polrelid = 'public.role_boundary_253'::regclass
      and polname = 'authenticated_public_rows_253'
      and pg_get_expr(polqual, polrelid) ilike '%visibility%'
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
