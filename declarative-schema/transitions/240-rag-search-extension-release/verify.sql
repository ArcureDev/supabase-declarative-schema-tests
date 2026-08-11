select jsonb_build_object(
  'identity',
  'public.transition_anchor'::regclass::oid,
  'valid',
  (
    select to_jsonb(anchor_row)
    from public.transition_anchor as anchor_row
    where anchor_row.id = 240
  ) = '{"id":240,"payload":"rag-search-extension"}'::jsonb
  and (
    select
      chunk.embedding::text = '[1,0,0]'
      and chunk.embedding_v2 is null
      and chunk.model_version_v2 = 'embed-v2'
    from app.chunks as chunk
    where chunk.id = 1
  )
  and (
    select namespace.nspname = 'extensions'
    from pg_extension as extension
    join pg_namespace as namespace
      on namespace.oid = extension.extnamespace
    where extension.extname = 'pg_trgm'
  )
  and exists (
    select 1
    from pg_ts_config
    where oid = 'app.catalog_english'::regconfig
  )
  and to_regclass('app.chunks_embedding_v2_idx') is not null
)::text;
