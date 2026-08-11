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
    select chunk.embedding::text = '[1,0,0]'
    from app.chunks as chunk
    where chunk.id = 1
  )
  and (
    select namespace.nspname = 'public'
    from pg_extension as extension
    join pg_namespace as namespace
      on namespace.oid = extension.extnamespace
    where extension.extname = 'pg_trgm'
  )
)::text;
