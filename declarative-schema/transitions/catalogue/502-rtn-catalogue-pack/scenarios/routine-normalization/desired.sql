-- Covers PG-CAT-RTN-03::routine.normalization. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_routine_normalization (
  id bigint primary key, label text, extra text
);
