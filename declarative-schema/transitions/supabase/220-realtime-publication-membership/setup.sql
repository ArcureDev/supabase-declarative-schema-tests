insert into public.transition_anchor (case_no, payload)
select
  220,
  jsonb_build_object(
    'feed_oid', feed.oid,
    'feed_owner', feed.relowner,
    'feed_acl', coalesce(to_jsonb(feed.relacl), 'null'::jsonb),
    'publication_oid', publication.oid
  )::text
from pg_class as feed
cross join pg_publication as publication
where feed.oid = 'public.realtime_feed_220'::regclass
  and publication.pubname = 'supabase_realtime';

insert into public.realtime_feed_220 (payload)
values ('preserved realtime row');
