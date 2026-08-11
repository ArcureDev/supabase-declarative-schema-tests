select jsonb_build_object(
          'identity',
          'public.transition_anchor'::regclass::oid,
          'valid',
          (
            select count(*) = 1
              and bool_and(case_no = 219 and payload = 'case-219')
            from public.transition_anchor
          )
          and (
        (select relrowsecurity from pg_class where oid = 'public.rls_items_219'::regclass)
and exists (
  select 1 from pg_policy
  where polrelid = 'public.rls_items_219'::regclass
    and polname = 'transition_update_219'
    and polcmd = 'w'
    and polpermissive
    and pg_get_expr(polqual, polrelid) not ilike '%archived%'
    and pg_get_expr(polwithcheck, polrelid) not ilike '%archived%'
)
and (select count(*) = 1 from public.rls_items_219 where not archived)
          )
        )::text;
