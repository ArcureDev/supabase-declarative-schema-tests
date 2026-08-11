-- Invariant: the installed local PostGIS version and application data are valid.
create extension if not exists postgis with schema extensions;
create table public.postgis_availability_anchor_275 (
  case_no integer primary key,
  payload text not null
);
