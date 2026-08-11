insert into public.transition_anchor values (1, 'preserved');

insert into public.data_shape_guard values (
  1,
  null,
  array['α', 'comma,value', null]::text[],
  '{"nested":{"ok":true},"n":123.4500}'::jsonb,
  decode('00ff10', 'hex'),
  repeat('x', 10000),
  9999999999999999.9999,
  timestamptz '2024-02-29 23:59:59.123456+00'
);
