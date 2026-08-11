-- Invariant: probing Realtime does not mutate publication metadata or source data.
select jsonb_build_object(
  'valid',
    (select relreplident = 'f' from pg_class where oid = 'public.realtime_source_262'::regclass)
    and exists (
      select 1 from pg_publication_rel relation
      join pg_publication publication on publication.oid = relation.prpubid
      where publication.pubname = 'supabase_realtime'
        and relation.prrelid = 'public.realtime_source_262'::regclass
    )
    and (select to_jsonb(source_row) from public.realtime_source_262 source_row where id = 262)
      = '{"id":262,"payload":"subscription-source"}'::jsonb
)::text;
