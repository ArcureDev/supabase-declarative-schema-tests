create type public.geo_point as (
  x numeric,
  y numeric
);

create table public.geo_point_lists (
  id bigint generated always as identity primary key,
  points public.geo_point[] not null
);
