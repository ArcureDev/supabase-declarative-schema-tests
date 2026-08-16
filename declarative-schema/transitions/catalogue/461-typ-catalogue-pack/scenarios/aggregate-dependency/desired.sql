-- Covers PG-CAT-TYP-07::aggregate.dependency. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_aggregate_dependency (
  id bigint primary key, label text, extra text
);
