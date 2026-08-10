select jsonb_build_object(
  'source_oid', 'public.rename_ambiguity_source'::regclass::oid,
  'target_oid', to_regclass('public.rename_ambiguity_target')::oid,
  'rows',
  coalesce(
    (
      select jsonb_agg(to_jsonb(source_row) order by source_row.id)
      from public.rename_ambiguity_source as source_row
    ),
    '[]'::jsonb
  )
)::text;
