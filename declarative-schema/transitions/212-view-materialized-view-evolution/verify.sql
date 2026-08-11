do $$
begin
  if (
    select relispopulated
    from pg_class
    where oid = 'public.transition_rollup'::regclass
  ) then
    raise exception 'transition_rollup must initially remain unpopulated';
  end if;
end
$$;

refresh materialized view public.transition_rollup;

select jsonb_build_object(
  'identity',
  'public.transition_anchor'::regclass::oid,
  'valid',
  (
    (select sum(doubled) = 10 from public.transition_live)
    and (
      select row_count = 2 and total = 5 and maximum = 3
      from public.transition_rollup
    )
    and (
      select relkind = 'm' and relispopulated
      from pg_class
      where oid = 'public.transition_rollup'::regclass
    )
  )
)::text;
