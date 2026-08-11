select jsonb_build_object(
          'identity',
          'public.transition_anchor'::regclass::oid,
          'valid',
          (
            select count(*) = 1
              and bool_and(case_no = 223 and payload = 'case-223')
            from public.transition_anchor
          )
          and (
        not exists (select 1 from pg_extension where extname = 'pg_trgm')
and to_regclass('public.transition_docs_trgm_223') is null
and (select count(*) = 2 from public.extension_docs_223)
          )
        )::text;
