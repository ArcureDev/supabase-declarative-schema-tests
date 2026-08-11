select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select payload = 'preserved'
     from public.transition_anchor where id = 1)
    and exists (
      select 1
      from public.data_shape_guard
      where id = 1
        and nullable_text is null
        and cardinality(tags) = 3
        and tags[1] = 'α'
        and tags[2] = 'comma,value'
        and tags[3] is null
        and document = '{"nested":{"ok":true},"n":123.4500}'::jsonb
        and encode(bytes, 'hex') = '00ff10'
        and length(large_text) = 10000
        and amount = 9999999999999999.9999
        and happened_at = timestamptz '2024-02-29 23:59:59.123456+00'
    )
)::text;
