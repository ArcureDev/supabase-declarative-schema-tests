select jsonb_build_object(
  'identity',
  (
    select oid
    from pg_policy
    where polrelid = 'public.auth_documents_226'::regclass
      and polname = 'auth_owned_documents_226'
  ),
  'valid',
  (
    select count(*) = 1
      and bool_and(
        case_no = 226
        and (payload::jsonb ->> 'table_oid')::oid =
          'public.auth_documents_226'::regclass::oid
        and (payload::jsonb ->> 'policy_oid')::oid = (
          select oid
          from pg_policy
          where polrelid = 'public.auth_documents_226'::regclass
            and polname = 'auth_owned_documents_226'
        )
      )
    from public.transition_anchor
  )
  and (
    select relrowsecurity and not relforcerowsecurity
    from pg_class
    where oid = 'public.auth_documents_226'::regclass
  )
  and (
    select count(*) = 1
      and bool_and(
        polcmd = '*'
        and polpermissive
        and polroles = array[
          (select oid from pg_roles where rolname = 'authenticated')
        ]::oid[]
        and pg_get_expr(polqual, polrelid) ilike '%auth.uid%'
        and pg_get_expr(polqual, polrelid) not ilike '%archived%'
        and pg_get_expr(polwithcheck, polrelid) ilike '%auth.uid%'
        and pg_get_expr(polwithcheck, polrelid) not ilike '%archived%'
      )
    from pg_policy
    where polrelid = 'public.auth_documents_226'::regclass
      and polname = 'auth_owned_documents_226'
  )
  and has_table_privilege(
    'authenticated',
    'public.auth_documents_226',
    'SELECT'
  )
  and not has_table_privilege(
    'authenticated',
    'public.auth_documents_226',
    'UPDATE'
  )
  and not has_table_privilege('anon', 'public.auth_documents_226', 'SELECT')
  and not has_table_privilege('anon', 'public.auth_documents_226', 'UPDATE')
  and (
    select jsonb_agg(to_jsonb(source_row) order by source_row.id)
    from public.auth_documents_226 as source_row
  ) = '[{"id":1,"body":"preserved Auth row","owner_id":"00000000-0000-0000-0000-000000000226","archived":false}]'::jsonb
)::text;
