select json_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and min(id) = 1 and min(payload) = 'preserved'
     from public.transition_anchor)
    and (select count(*) = 2 from public.advanced_documents)
    and not (select indisclustered from pg_index
             where indexrelid =
               'public.advanced_documents_cluster_idx'::regclass)
    and not (select indisreplident from pg_index
             where indexrelid =
               'public.advanced_documents_external_uidx'::regclass)
)::text;
