select jsonb_build_object(
          'identity',
          'public.transition_anchor'::regclass::oid,
          'valid',
          (
            select count(*) = 1
              and bool_and(case_no = 233 and payload = 'case-233')
            from public.transition_anchor
          )
          and (
        to_regclass('public.transition_vector_hnsw_233') is null
and (
  select jsonb_agg(embedding::text order by id)
  from public.vector_items_233
) = '["[1,0,0]","[0,1,0]"]'::jsonb
          )
        )::text;
