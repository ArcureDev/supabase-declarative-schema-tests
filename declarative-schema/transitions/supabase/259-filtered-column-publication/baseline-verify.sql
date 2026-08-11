select jsonb_build_object(
  'identity', 'public.realtime_filtered_259'::regclass::oid,
  'valid',
    exists (
      select 1
      from pg_publication_rel relation
      join pg_publication publication on publication.oid = relation.prpubid
      where publication.pubname = 'supabase_realtime'
        and relation.prrelid = 'public.realtime_filtered_259'::regclass
        and relation.prattrs is null
        and relation.prqual is null
    )
    and (select count(*) = 2 from public.realtime_filtered_259)
)::text;
