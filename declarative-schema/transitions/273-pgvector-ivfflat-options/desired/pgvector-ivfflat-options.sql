-- Invariant: only the IVFFlat list count changes.
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists vector with schema extensions;
create table public.vector_ivfflat_items_273 (
  id bigint generated always as identity primary key,
  embedding extensions.vector(3) not null,
  label text not null
);
create index transition_vector_ivfflat_273
  on public.vector_ivfflat_items_273
  using ivfflat (embedding extensions.vector_cosine_ops)
  with (lists = 8);
