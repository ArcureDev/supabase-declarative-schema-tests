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
    and pg_get_expr(polqual, polrelid) ilike '%archived%'
    and pg_get_expr(polwithcheck, polrelid) ilike '%archived%'
)
and (
  select jsonb_agg(to_jsonb(source_row) order by source_row.id)
  from public.rls_items_219 source_row
) = '[{"id":1,"tenant_id":"00000000-0000-0000-0000-000000000219","archived":false,"body":"preserved RLS row"}]'::jsonb
          )
        )::text;
