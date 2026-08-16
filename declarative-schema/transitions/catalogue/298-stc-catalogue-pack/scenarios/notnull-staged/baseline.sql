-- Covers PG-CAT-STC-06::notnull.staged. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_notnull_staged (
  id bigint primary key, label text
);
