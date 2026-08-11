insert into public.transition_anchor (id, payload)
values (241, 'geospatial-analytics');

insert into geodata.regions (id, tenant_id, boundary)
values (
  1,
  7,
  extensions.st_geomfromtext(
    'POLYGON((-1 -1,-1 1,1 1,1 -1,-1 -1))',
    4326
  )
);

insert into geodata.places (id, region_id, name, location)
values (
  1,
  1,
  'Origin',
  extensions.st_geomfromtext('POINT(0 0)', 4326)
);

insert into analytics.events (
  id,
  tenant_id,
  event_kind,
  occurred_on,
  payload
)
values (1, 7, 'visit', '2026-08-10', '{"place":1}'::jsonb);
