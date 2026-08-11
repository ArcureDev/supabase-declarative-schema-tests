select jsonb_build_object(
  'identity',
  'public.transition_anchor'::regclass::oid,
  'valid',
  (
    public.transition_scalar_to_integer(row(7)::public.transition_scalar) = 7
    and public.transition_near(7, 8)
    and not exists (
      select 1
      from pg_cast
      where castsource = 'public.transition_scalar'::regtype
        and casttarget = 'integer'::regtype
    )
    and not exists (
      select 1
      from pg_operator
      where oprnamespace = 'public'::regnamespace
        and oprname = '~='
    )
    and not exists (
      select 1
      from pg_transform
      where trftype = 'public.transition_scalar'::regtype
    )
  )
)::text;
