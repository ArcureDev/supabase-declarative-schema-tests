select json_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and min(id) = 1 and min(payload) = 'preserved'
     from public.transition_anchor)
    and (select array_agg(id order by id) = array[1,2,3,5]::bigint[]
         from public.partition_events)
    and (select count(*) = 1 and min(id) = 4
         from public.partition_events_retire)
    and not exists (
      select 1 from pg_inherits
      where inhrelid = 'public.partition_events_retire'::regclass
    )
    and pg_get_expr(
      (select relpartbound from pg_class
       where oid = 'public.partition_events_2024'::regclass),
      'public.partition_events_2024'::regclass
    ) ilike '%2024-07-01%'
    and to_regclass('public.partition_events_2025_eu') is not null
    and to_regclass('public.partition_events_2026') is not null
    and pg_get_expr(
      (select relpartbound from pg_class
       where oid = 'public.partition_events_2026'::regclass),
      'public.partition_events_2026'::regclass
    ) ilike '%2026-01-01%2027-01-01%'
    and to_regclass('public.partition_events_obsolete') is null
    and to_regclass('public.partition_metrics_p1') is not null
    and (select tableoid = 'public.partition_events_2025_eu'::regclass
         from public.partition_events where id = 2)
    and (select tableoid = 'public.partition_events_default'::regclass
         from public.partition_events where id = 5)
)::text;
