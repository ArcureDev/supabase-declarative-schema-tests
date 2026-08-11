update public.transition_trigger_source
set body = 'beta'
where id = 1;

insert into public.transition_trigger_source (body) values ('gamma');

select jsonb_build_object(
  'identity',
  'public.transition_anchor'::regclass::oid,
  'valid',
  (
    (
      select jsonb_agg(entry order by id) =
        '["v1:alpha", "v2:beta", "v2:gamma"]'::jsonb
      from public.transition_trigger_log
    )
    and pg_get_triggerdef((
      select oid
      from pg_trigger
      where tgrelid = 'public.transition_trigger_source'::regclass
        and tgname = 'transition_capture'
    )) like '%INSERT OR UPDATE%'
  )
)::text;
