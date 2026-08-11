truncate public.transition_ddl_log;
create table public.transition_probe_216_b (id integer);
drop table public.transition_probe_216_b;

select jsonb_build_object(
  'identity',
  'public.transition_anchor'::regclass::oid,
  'valid',
  (
    (
      select jsonb_agg(entry order by id) = '["v2:CREATE TABLE"]'::jsonb
      from public.transition_ddl_log
    )
    and (
      select evtenabled = 'O'
      from pg_event_trigger
      where evtname = 'transition_ddl_watch'
    )
  )
)::text;
