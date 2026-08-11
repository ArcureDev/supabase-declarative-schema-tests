select jsonb_build_object(
  'table_oid',
  'public.recovery_after_failure_guard'::regclass::oid,
  'not_null',
  (
    select attnotnull
    from pg_attribute
    where attrelid = 'public.recovery_after_failure_guard'::regclass
      and attname = 'required_later'
      and not attisdropped
  ),
  'rows',
  (
    select jsonb_agg(to_jsonb(source_row) order by source_row.id)
    from public.recovery_after_failure_guard as source_row
  )
)::text;
