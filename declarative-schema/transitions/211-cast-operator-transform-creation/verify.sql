select jsonb_build_object(
  'identity',
  'public.transition_anchor'::regclass::oid,
  'valid',
  (
    (row(7)::public.transition_scalar)::integer = 7
    and 7 operator(public.~=) 8
    and exists (
      select 1
      from pg_cast
      where castsource = 'public.transition_scalar'::regtype
        and casttarget = 'integer'::regtype
        and castcontext = 'a'
    )
    and exists (
      select 1
      from pg_operator
      where oprnamespace = 'public'::regnamespace
        and oprname = '~='
    )
    and exists (
      select 1
      from pg_transform
      where trftype = 'public.transition_scalar'::regtype
        and trflang = (
          select oid from pg_language where lanname = 'plpgsql'
        )
        and trffromsql =
          'public.transition_scalar_from_sql(internal)'::regprocedure
    )
  )
)::text;
