select jsonb_build_object(
  'identity',
  'public.grants_rls_guard'::regclass::oid,
  'valid',
  (
    select relrowsecurity
    from pg_class
    where oid = 'public.grants_rls_guard'::regclass
  )
  and exists (
    select 1
    from pg_policy
    where polrelid = 'public.grants_rls_guard'::regclass
      and polname = 'grants_rls_guard_select'
      and polcmd = 'r'
      and polpermissive
  )
  and has_table_privilege(
    'authenticated',
    'public.grants_rls_guard',
    'SELECT, INSERT, UPDATE'
  )
  and not has_table_privilege(
    'authenticated',
    'public.grants_rls_guard',
    'DELETE'
  )
  and (
    select jsonb_agg(to_jsonb(source_row) order by source_row.id)
    from public.grants_rls_guard as source_row
  ) = '[{
    "id": 1,
    "owner_name": "authenticated",
    "payload": "protected row"
  }]'::jsonb
)::text;
