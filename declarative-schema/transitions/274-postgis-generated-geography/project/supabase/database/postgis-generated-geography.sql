-- Invariant: longitude and latitude are the source of truth before generation.
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists postgis with schema extensions;
create table public.generated_places_274 (
  id bigint generated always as identity primary key,
  name text not null,
  longitude double precision not null,
  latitude double precision not null
);
