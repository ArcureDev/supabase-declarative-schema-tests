select jsonb_build_object(
  'table_oid',
  'public.dependency_source'::regclass::oid,
  'data_valid',
  (
    select jsonb_agg(to_jsonb(source_row) order by source_row.id)
    from public.dependency_source as source_row
  ) = '[
    {
      "id": 1,
      "raw_value": 10
    },
    {
      "id": 2,
      "raw_value": -3
    }
  ]'::jsonb,
  'row_count',
  (select count(*) from public.dependency_source)
)::text;
