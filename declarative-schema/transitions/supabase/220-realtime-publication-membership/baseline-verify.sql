select jsonb_build_object(
          'identity',
          'public.transition_anchor'::regclass::oid,
          'valid',
          (
            select count(*) = 1
              and bool_and(case_no = 220 and payload = 'case-220')
            from public.transition_anchor
          )
          and (
        (select relreplident = 'd' from pg_class where oid = 'public.realtime_feed_220'::regclass)
and not exists (
  select 1 from pg_publication_rel relation
  join pg_publication publication on publication.oid = relation.prpubid
  where publication.pubname = 'supabase_realtime'
    and relation.prrelid = 'public.realtime_feed_220'::regclass
)
and (select count(*) = 1 from public.realtime_feed_220)
          )
        )::text;
