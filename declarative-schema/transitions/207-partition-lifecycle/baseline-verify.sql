select json_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and min(id) = 1 and min(payload) = 'preserved'
     from public.transition_anchor)
    and (select count(*) = 5 from public.partition_events)
    and exists (
      select 1 from pg_inherits
      where inhparent = 'public.partition_events'::regclass
        and inhrelid = 'public.partition_events_retire'::regclass
    )
    and pg_get_expr(
      (select relpartbound from pg_class
       where oid = 'public.partition_events_2024'::regclass),
      'public.partition_events_2024'::regclass
    ) ilike '%2024-06-01%'
)::text;
