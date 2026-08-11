-- Invariant: typmod tightening preserves identity, rows, and four dimensions.
select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and bool_and(case_no = 272 and payload = 'case-272')
       from public.transition_anchor)
    and (
      select format_type(attribute.atttypid, attribute.atttypmod)
               like '%vector(4)'
      from pg_attribute attribute
      where attribute.attrelid = 'public.vector_dimensions_272'::regclass
        and attribute.attname = 'embedding'
        and not attribute.attisdropped
    )
    and (
      select count(*) = 2
        and bool_and(extensions.vector_dims(embedding) = 4)
      from public.vector_dimensions_272
    )
    and (
      select jsonb_agg(label order by id)
      from public.vector_dimensions_272
    ) = '["north","east"]'::jsonb
)::text;
