select jsonb_build_object(
  'identity',
  'public.transition_anchor'::regclass::oid,
  'valid',
  (
    (select count(*) = 0 from public.transition_ddl_log)
    and (
      select evtenabled = 'D'
      from pg_event_trigger
      where evtname = 'transition_ddl_watch'
    )
  )
)::text;
