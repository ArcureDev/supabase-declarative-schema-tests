select jsonb_build_object(
          'identity',
          'public.transition_anchor'::regclass::oid,
          'valid',
          (
            select count(*) = 1
              and bool_and(case_no = 234 and payload = 'case-234')
            from public.transition_anchor
          )
          and (
        to_regclass('public.transition_places_gist_234') is null
and (
  select count(*) = 2
    and bool_and(extensions.st_srid(location::extensions.geometry) = 4326)
  from public.places_234
)
          )
        )::text;
