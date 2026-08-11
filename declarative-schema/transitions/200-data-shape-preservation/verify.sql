insert into public.data_shape_guard (
  id, nullable_text, tags, document, bytes, large_text, amount, happened_at
) values (
  2, '', '{}'::text[], 'null'::jsonb, decode('', 'hex'), '',
  -9999999999999999.9999, 'infinity'::timestamptz
);

select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    exists (
      select 1
      from pg_attribute a
      join pg_attrdef d
        on d.adrelid = a.attrelid and d.adnum = a.attnum
      where a.attrelid = 'public.data_shape_guard'::regclass
        and a.attname = 'shape_version'
        and format_type(a.atttypid, a.atttypmod) = 'smallint'
        and a.attnotnull
        and pg_get_expr(d.adbin, d.adrelid) = '1'
        and not a.attisdropped
    )
    and exists (
      select 1
      from public.data_shape_guard
      where id = 1
        and nullable_text is null
        and cardinality(tags) = 3
        and tags[1] = 'α'
        and tags[3] is null
        and document = '{"nested":{"ok":true},"n":123.4500}'::jsonb
        and encode(bytes, 'hex') = '00ff10'
        and length(large_text) = 10000
        and amount = 9999999999999999.9999
        and happened_at = timestamptz '2024-02-29 23:59:59.123456+00'
        and shape_version = 1
    )
    and exists (
      select 1
      from public.data_shape_guard
      where id = 2
        and nullable_text = ''
        and cardinality(tags) = 0
        and document = 'null'::jsonb
        and octet_length(bytes) = 0
        and large_text = ''
        and amount = -9999999999999999.9999
        and happened_at = 'infinity'::timestamptz
        and shape_version = 1
    )
)::text;
