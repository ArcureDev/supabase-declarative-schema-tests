-- Invariant: runtime subscription eligibility requires membership and full identity.
create table public.realtime_source_262 (
  id bigint primary key,
  payload text not null
);
alter table public.realtime_source_262 replica identity full;
alter publication supabase_realtime add table public.realtime_source_262;
insert into public.realtime_source_262 values (262, 'subscription-source');

select jsonb_build_object(
  'valid',
    (select relreplident = 'f' from pg_class where oid = 'public.realtime_source_262'::regclass)
    and exists (
      select 1 from pg_publication_rel relation
      join pg_publication publication on publication.oid = relation.prpubid
      where publication.pubname = 'supabase_realtime'
        and relation.prrelid = 'public.realtime_source_262'::regclass
    )
)::text;
