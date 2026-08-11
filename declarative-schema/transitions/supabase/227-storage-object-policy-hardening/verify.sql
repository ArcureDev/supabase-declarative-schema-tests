select jsonb_build_object(
          'identity',
          'public.transition_anchor'::regclass::oid,
          'valid',
          (
            select count(*) = 1
              and bool_and(case_no = 227 and payload = 'case-227')
            from public.transition_anchor
          )
          and (
        exists (
  select 1 from pg_policy
  where polrelid = 'storage.objects'::regclass
    and polname = 'transition_storage_insert_227'
    and polcmd = 'a'
    and pg_get_expr(polwithcheck, polrelid) ilike '%transition-227%'
    and pg_get_expr(polwithcheck, polrelid) ilike '%foldername%'
    and pg_get_expr(polwithcheck, polrelid) ilike '%jwt%'
)
          )
        )::text;
