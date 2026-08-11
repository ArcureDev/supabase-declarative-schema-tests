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
        exists (
  select 1
  from pg_index index_state
  join pg_class index_relation on index_relation.oid = index_state.indexrelid
  join pg_am access_method on access_method.oid = index_relation.relam
  where index_state.indexrelid = 'public.transition_vector_hnsw_233'::regclass
    and index_state.indisvalid
    and index_state.indisready
    and access_method.amname = 'hnsw'
    and index_relation.reloptions @> array['m=8', 'ef_construction=32']
)
and (
  select jsonb_agg(embedding::text order by id)
  from public.vector_items_233
) = '["[1,0,0]","[0,1,0]"]'::jsonb
          )
        )::text;
