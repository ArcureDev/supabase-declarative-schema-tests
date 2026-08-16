-- Covers PG-CAT-RTN-05::aggregate.ordinary. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_aggregate_ordinary (
  id bigint primary key, label text
);
