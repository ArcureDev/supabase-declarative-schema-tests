create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists postgis with schema extensions;
create table public.places_234 (
  id bigint generated always as identity primary key,
  name text not null,
  location extensions.geography(point, 4326) not null
);
create index transition_places_gist_234
  on public.places_234
  using gist (location extensions.gist_geography_ops);
