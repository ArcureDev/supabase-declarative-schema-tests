-- Invariant: an impossible optional PostGIS version produces an explicit diagnostic.
create extension if not exists postgis with schema extensions;
create extension if not exists postgis_raster
  with schema extensions
  version '99.99.275';
create table public.postgis_availability_anchor_275 (
  case_no integer primary key,
  payload text not null
);
