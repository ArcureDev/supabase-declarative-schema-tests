-- Invariant: state A is populated and has no vector typmod.
select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and bool_and(case_no = 272 and payload = 'case-272')
       from public.transition_anchor)
    and (
      select attribute.atttypmod = -1
      from pg_attribute attribute
      where attribute.attrelid = 'public.vector_dimensions_272'::regclass
        and attribute.attname = 'embedding'
        and not attribute.attisdropped
    )
    and (
      select jsonb_agg(embedding::text order by id)
      from public.vector_dimensions_272
    ) = '["[1,0,0,0]","[0,1,0,0]"]'::jsonb
)::text;
