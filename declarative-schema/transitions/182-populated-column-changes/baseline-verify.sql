select jsonb_build_object(
  'table_oid',
  'public.populated_column_changes'::regclass::oid,
  'data_valid',
  (
    select jsonb_agg(to_jsonb(source_row) order by source_row.id)
    from public.populated_column_changes as source_row
  ) = '[
    {
      "id": 1,
      "immutable_value": "alpha",
      "widening_value": 42,
      "defaulted_value": "before",
      "nullable_value": "present"
    },
    {
      "id": 2,
      "immutable_value": "βeta",
      "widening_value": 2147483647,
      "defaulted_value": "custom",
      "nullable_value": "also present"
    }
  ]'::jsonb,
  'row_count',
  (select count(*) from public.populated_column_changes)
)::text;
