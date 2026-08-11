select jsonb_build_object(
  'table_oid',
  'public.destructive_change_guard'::regclass::oid,
  'column_attribute_number',
  (
    select attnum
    from pg_attribute
    where attrelid = 'public.destructive_change_guard'::regclass
      and attname = 'doomed_value'
      and not attisdropped
  ),
  'rows',
  coalesce(
    (
      select jsonb_agg(to_jsonb(source_row) order by source_row.id)
      from public.destructive_change_guard as source_row
    ),
    '[]'::jsonb
  )
)::text;
