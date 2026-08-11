insert into public.transition_type_rows (status) values ('reviewing');

select jsonb_build_object(
  'identity',
  'public.transition_anchor'::regclass::oid,
  'valid',
  (
    enum_range(null::public.transition_status)::text[] =
      array['new', 'reviewing', 'done']
    and 'reviewing'::public.transition_status < 'done'::public.transition_status
    and (
      select code = 'queued'
      from public.transition_type_rows
      where id = 2
    )
    and (
      select typdefault like '%queued%'
      from pg_type
      where oid = 'public.transition_code'::regtype
    )
  )
)::text;
