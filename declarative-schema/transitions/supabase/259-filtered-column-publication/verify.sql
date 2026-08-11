-- Invariant: column/filter catalogs change in place and both source rows remain.
select jsonb_build_object(
  'identity', 'public.realtime_filtered_259'::regclass::oid,
  'valid',
    exists (
      select 1
      from pg_publication_rel relation
      join pg_publication publication on publication.oid = relation.prpubid
      where publication.pubname = 'supabase_realtime'
        and relation.prrelid = 'public.realtime_filtered_259'::regclass
        and relation.prattrs is not null
        and pg_get_expr(relation.prqual, relation.prrelid) ilike '%tenant_id > 0%'
    )
    and exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'realtime_filtered_259'
        and attnames = array['id', 'tenant_id']::name[]
        and rowfilter ilike '%tenant_id > 0%'
    )
    and (select jsonb_agg(to_jsonb(source_row) order by id) from public.realtime_filtered_259 source_row)
      = '[{"id":1,"payload":"included","tenant_id":7},{"id":2,"payload":"filtered-but-preserved","tenant_id":0}]'::jsonb
)::text;
