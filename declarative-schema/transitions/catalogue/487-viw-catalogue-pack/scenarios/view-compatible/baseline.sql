-- Covers PG-CAT-VIW-02::view.compatible. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_view_compatible (
  id bigint primary key, label text
);
