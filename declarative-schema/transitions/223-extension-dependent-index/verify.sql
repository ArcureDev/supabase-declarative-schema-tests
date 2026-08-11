select jsonb_build_object(
          'identity',
          'public.transition_anchor'::regclass::oid,
          'valid',
          (
            select count(*) = 1
              and bool_and(case_no = 223 and payload = 'case-223')
            from public.transition_anchor
          )
          and (
        exists (
  select 1 from pg_extension
  where extname = 'pg_trgm'
    and extnamespace = 'extensions'::regnamespace
)
and exists (
  select 1 from pg_index
  where indexrelid = 'public.transition_docs_trgm_223'::regclass
    and indisvalid and indisready
)
and extensions.similarity('schema', 'schemas') > 0
and (select count(*) = 2 from public.extension_docs_223)
          )
        )::text;
