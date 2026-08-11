select jsonb_build_object(
  'identity',
  'public.transition_anchor'::regclass::oid,
  'valid',
  (
    (select sum(amount) = 5 from public.transition_live)
    and (
      select row_count = 2 and total = 5
      from public.transition_rollup
    )
    and (
      select relkind = 'm' and relispopulated
      from pg_class
      where oid = 'public.transition_rollup'::regclass
    )
  )
)::text;
