select jsonb_build_object(
  'identity',
  'public.transition_anchor'::regclass::oid,
  'valid',
  (
    select to_jsonb(anchor_row)
    from public.transition_anchor as anchor_row
    where anchor_row.id = 244
  ) = '{"id":244,"payload":"legacy-normalization"}'::jsonb
  and legacy."DisplayName"(1) = 'Ada Lovelace'
  and (select count(*) = 1 from legacy."CustomerSummary")
  and exists (
    select 1
    from pg_inherits
    where inhrelid = 'legacy."ClickEvent"'::regclass
      and inhparent = 'legacy.activity_base'::regclass
  )
)::text;
