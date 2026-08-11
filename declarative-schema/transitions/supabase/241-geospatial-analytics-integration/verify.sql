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
    select
      extensions.st_srid(place.location) = 4326
      and extensions.st_srid(place.location_webmercator) = 3857
    from geodata.places as place
    where place.id = 1
  )
  and to_regclass('geodata.places_location_gist_idx') is not null
  and exists (
    select 1
    from pg_policy
    where polrelid = 'geodata.places'::regclass
      and polname = 'places_region_access'
      and pg_get_expr(polqual, polrelid) ilike '%auth.jwt()%'
      and pg_get_expr(polqual, polrelid) ilike '%region_id%'
  )
  and to_regclass('analytics.events_2026_q4') is not null
  and exists (
    select 1
    from pg_publication
    where pubname = 'ds_241_analytics_publication'
      and pubviaroot
  )
  and to_regclass('analytics.partner_events') is not null
)::text;
