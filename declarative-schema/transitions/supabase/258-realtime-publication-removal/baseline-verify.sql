select jsonb_build_object(
  'identity', 'public.realtime_feed_258'::regclass::oid,
  'valid',
    (select relreplident = 'f' from pg_class where oid = 'public.realtime_feed_258'::regclass)
    and exists (
      select 1
      from pg_publication_rel relation
      join pg_publication publication on publication.oid = relation.prpubid
      where publication.pubname = 'supabase_realtime'
        and relation.prrelid = 'public.realtime_feed_258'::regclass
    )
    and (select jsonb_agg(to_jsonb(feed) order by id) from public.realtime_feed_258 feed)
      = '[{"id":1,"payload":"preserved-258"}]'::jsonb
)::text;
