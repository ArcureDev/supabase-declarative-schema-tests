-- Invariant: the table is altered in place, never rebuilt for a typmod change.
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists vector with schema extensions;
create table public.vector_dimensions_272 (
  id bigint generated always as identity primary key,
  embedding extensions.vector(4) not null,
  label text not null
);
