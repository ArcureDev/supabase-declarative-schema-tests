-- Covers PG-CAT-STC-09::sequence.cache. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_sequence_cache (
  id bigint primary key, label text
);
