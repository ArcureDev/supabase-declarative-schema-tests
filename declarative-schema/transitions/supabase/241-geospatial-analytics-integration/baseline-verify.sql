select jsonb_build_object(
  'identity',
  'public.transition_anchor'::regclass::oid,
  'valid',
  (
    select to_jsonb(anchor_row)
    from public.transition_anchor as anchor_row
    where anchor_row.id = 241
  ) = '{"id":241,"payload":"geospatial-analytics"}'::jsonb
  and (
    select extensions.st_srid(place.location) = 4326
    from geodata.places as place
    where place.id = 1
  )
  and (select count(*) = 1 from analytics.events)
)::text;
