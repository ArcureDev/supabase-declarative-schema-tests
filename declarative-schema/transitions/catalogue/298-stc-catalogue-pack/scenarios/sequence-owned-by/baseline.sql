-- Covers PG-CAT-STC-09::sequence.owned-by. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_sequence_owned_by (
  id bigint primary key, label text
);
