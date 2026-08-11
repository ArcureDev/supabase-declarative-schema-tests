-- Invariant: catalog generation metadata and derived SRID are exact.
select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and bool_and(case_no = 274 and payload = 'case-274')
       from public.transition_anchor)
    and exists (
      select 1
      from pg_attribute attribute
      join pg_attrdef default_state
        on default_state.adrelid = attribute.attrelid
       and default_state.adnum = attribute.attnum
      where attribute.attrelid = 'public.generated_places_274'::regclass
        and attribute.attname = 'location'
        and attribute.attgenerated = 's'
        and pg_get_expr(default_state.adbin, default_state.adrelid)
              ilike '%st_makepoint%'
    )
    and (
      select count(*) = 2
        and bool_and(extensions.st_srid(location::extensions.geometry) = 4326)
        and bool_and(
          abs(extensions.st_x(location::extensions.geometry) - longitude) < 0.000001
          and abs(extensions.st_y(location::extensions.geometry) - latitude) < 0.000001
        )
      from public.generated_places_274
    )
)::text;
