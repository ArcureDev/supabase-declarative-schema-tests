-- Covers PG-CAT-EXT-02::extension.owned-objects. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_extension_owned_objects (
  id bigint primary key, label text
);
