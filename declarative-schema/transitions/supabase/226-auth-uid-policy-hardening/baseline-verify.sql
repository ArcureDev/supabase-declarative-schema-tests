select jsonb_build_object(
          'identity',
          'public.transition_anchor'::regclass::oid,
          'valid',
          (
            select count(*) = 1
              and bool_and(case_no = 226 and payload = 'case-226')
            from public.transition_anchor
          )
          and (
        exists (
  select 1 from pg_policy
  where polrelid = 'public.auth_documents_226'::regclass
    and polname = 'auth_owned_documents_226'
    and pg_get_expr(polqual, polrelid) ilike '%uid%'
    and pg_get_expr(polqual, polrelid) not ilike '%archived%'
)
and has_table_privilege('authenticated', 'public.auth_documents_226', 'SELECT')
and not has_table_privilege('authenticated', 'public.auth_documents_226', 'UPDATE')
and (select count(*) = 1 from public.auth_documents_226)
          )
        )::text;
