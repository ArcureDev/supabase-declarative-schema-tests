select jsonb_build_object(
  'identity',
  'public.realtime_feed_220'::regclass::oid,
  'valid',
  (
    select count(*) = 1
      and bool_and(
        case_no = 220
        and (payload::jsonb ->> 'feed_oid')::oid =
          'public.realtime_feed_220'::regclass::oid
        and (payload::jsonb ->> 'publication_oid')::oid = (
          select oid from pg_publication where pubname = 'supabase_realtime'
        )
        and (payload::jsonb ->> 'feed_owner')::oid = (
          select relowner
          from pg_class
          where oid = 'public.realtime_feed_220'::regclass
        )
        and payload::jsonb -> 'feed_acl' = (
          select coalesce(to_jsonb(relacl), 'null'::jsonb)
          from pg_class
          where oid = 'public.realtime_feed_220'::regclass
        )
      )
    from public.transition_anchor
  )
  and (
    select relreplident = 'd'
    from pg_class
    where oid = 'public.realtime_feed_220'::regclass
  )
  and not exists (
    select 1
    from pg_publication_rel as publication_relation
    join pg_publication as publication
      on publication.oid = publication_relation.prpubid
    where publication.pubname = 'supabase_realtime'
      and publication_relation.prrelid = 'public.realtime_feed_220'::regclass
  )
  and (
    select jsonb_agg(to_jsonb(source_row) order by source_row.id)
    from public.realtime_feed_220 as source_row
  ) = '[{"id":1,"payload":"preserved realtime row"}]'::jsonb
)::text;
