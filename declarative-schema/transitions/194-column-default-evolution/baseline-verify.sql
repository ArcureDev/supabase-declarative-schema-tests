select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select pg_get_expr(d.adbin, d.adrelid) = '''before''::text'
     from pg_attribute a
     join pg_attrdef d on d.adrelid = a.attrelid and d.adnum = a.attnum
     where a.attrelid = 'public.default_guard'::regclass
       and a.attname = 'status')
    and (select array_agg(status order by id) = array['before','explicit']
         from public.default_guard)
)::text;
