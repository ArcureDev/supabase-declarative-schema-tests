select jsonb_build_object(
  'table_oid',
  'public.deterministic_output_anchor'::regclass::oid,
  'rows',
  (
    select jsonb_agg(to_jsonb(anchor_row) order by anchor_row.id)
    from public.deterministic_output_anchor as anchor_row
  )
)::text;
