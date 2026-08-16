-- Covers PG-CAT-EXT-01::extension.create. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_extension_create (
  id bigint primary key, label text
);
