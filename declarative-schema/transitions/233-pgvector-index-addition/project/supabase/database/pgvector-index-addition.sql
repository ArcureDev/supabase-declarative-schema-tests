create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists vector with schema extensions;
create table public.vector_items_233 (
  id bigint generated always as identity primary key,
  embedding extensions.vector(3) not null
);
