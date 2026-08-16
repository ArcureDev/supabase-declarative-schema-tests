-- Covers PG-CAT-STC-04::cast.implicit. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_cast_implicit (
  id bigint primary key, label text
);
