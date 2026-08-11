select jsonb_build_object(
  'identity',
  'public.transition_anchor'::regclass::oid,
  'valid',
  (
    (
      select
        (payload).left_value = 1
        and (payload).right_value = 2
        and (payload).unit is null
        and span @> 2
      from public.transition_shape_rows
      where id = 1
    )
    and (row(3, 4, 'm')::public.transition_pair).unit = 'm'
    and '[2026-01-01,2026-01-03)'::public.transition_date_span
      @> '2026-01-02'::date
    and (
      select rngsubtype = 'date'::regtype
      from pg_range
      where rngtypid = 'public.transition_date_span'::regtype
    )
  )
)::text;
