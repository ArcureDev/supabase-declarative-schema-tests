select json_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and min(id) = 1 and min(payload) = 'preserved'
     from public.transition_anchor)
    and (select count(*) = 2 and min(external_id) = 'ext-a'
         from public.advanced_documents)
    and (select indisclustered from pg_index
         where indexrelid =
           'public.advanced_documents_cluster_idx'::regclass)
    and (select indisreplident from pg_index
         where indexrelid =
           'public.advanced_documents_external_uidx'::regclass)
    and (
      select count(*) = 6
        and bool_and(
          a.amname = case
            when i.relname in (
              'advanced_documents_tags_gin_idx',
              'advanced_documents_body_trgm_a_idx',
              'advanced_documents_body_trgm_b_idx'
            ) then 'gin'
            when i.relname = 'advanced_documents_location_gist_idx' then 'gist'
            when i.relname = 'advanced_documents_network_spgist_idx' then 'spgist'
            when i.relname = 'advanced_documents_recorded_brin_idx' then 'brin'
          end
        )
      from pg_class i
      join pg_index x on x.indexrelid = i.oid
      join pg_am a on a.oid = i.relam
      where x.indrelid = 'public.advanced_documents'::regclass
        and i.relname in (
          'advanced_documents_tags_gin_idx',
          'advanced_documents_location_gist_idx',
          'advanced_documents_network_spgist_idx',
          'advanced_documents_recorded_brin_idx',
          'advanced_documents_body_trgm_a_idx',
          'advanced_documents_body_trgm_b_idx'
        )
        and a.amname in ('gin','gist','spgist','brin')
    )
    and pg_get_indexdef(
      'public.advanced_documents_body_trgm_a_idx'::regclass
    ) ilike '%gin_trgm_ops%'
    and pg_get_indexdef(
      'public.advanced_documents_body_trgm_b_idx'::regclass
    ) ilike '%gin_trgm_ops%'
)::text;
