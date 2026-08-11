select jsonb_build_object(
  'identity',
  'public.transition_anchor'::regclass::oid,
  'valid',
  (
    (
      select
        (payload).left_value = 1
        and (payload).right_value = 2
        and span @> 2
      from public.transition_shape_rows
      where id = 1
    )
    and (
      select typtype = 'r'
      from pg_type
      where oid = 'public.transition_int_span'::regtype
    )
  )
)::text;
