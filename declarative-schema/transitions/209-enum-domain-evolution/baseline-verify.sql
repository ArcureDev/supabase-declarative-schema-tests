select jsonb_build_object(
  'identity',
  'public.transition_anchor'::regclass::oid,
  'valid',
  (
    enum_range(null::public.transition_status)::text[] = array['new', 'done']
    and (
      select code = 'alpha'
      from public.transition_type_rows
      where id = 1
    )
    and (
      select typdefault like '%draft%'
      from pg_type
      where oid = 'public.transition_code'::regtype
    )
  )
)::text;
