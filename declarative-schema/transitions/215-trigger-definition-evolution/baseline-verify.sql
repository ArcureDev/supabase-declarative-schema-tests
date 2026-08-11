select jsonb_build_object(
  'identity',
  'public.transition_anchor'::regclass::oid,
  'valid',
  (
    (
      select jsonb_agg(entry order by id) = '["v1:alpha"]'::jsonb
      from public.transition_trigger_log
    )
    and pg_get_triggerdef((
      select oid
      from pg_trigger
      where tgrelid = 'public.transition_trigger_source'::regclass
        and tgname = 'transition_capture'
    )) like '%AFTER INSERT%'
  )
)::text;
