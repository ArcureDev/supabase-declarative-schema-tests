-- Invariant: state A records a real installed version, never the fake target.
select jsonb_build_object(
  'identity', 'public.postgis_availability_anchor_275'::regclass::oid,
  'valid',
    (select count(*) = 1 and bool_and(case_no = 275 and payload = 'case-275')
       from public.postgis_availability_anchor_275)
    and exists (
      select 1
      from pg_extension
      where extname = 'postgis'
        and extversion <> '99.99.275'
        and extnamespace = 'extensions'::regnamespace
    )
)::text;
