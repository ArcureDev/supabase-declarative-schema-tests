-- Covers PG-CAT-VIW-01::view.drop. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_view_drop (
  id bigint primary key, label text
);
