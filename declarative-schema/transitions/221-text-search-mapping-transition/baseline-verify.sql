select jsonb_build_object(
        'identity',
        'public.transition_anchor'::regclass::oid,
        'valid',
        (
          select count(*) = 1
            and bool_and(case_no = 221 and payload = 'case-221')
          from public.transition_anchor
        )
        and (
      to_tsvector('public.transition_search_221'::regconfig, 'running')
= to_tsvector('pg_catalog.simple'::regconfig, 'running')
        )
      )::text;
