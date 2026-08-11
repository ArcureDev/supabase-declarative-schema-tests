-- Invariant: compatible four-dimensional rows survive typmod tightening.
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists vector with schema extensions;
create table public.vector_dimensions_272 (
  id bigint generated always as identity primary key,
  embedding extensions.vector not null,
  label text not null
);
