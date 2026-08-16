-- Covers PG-CAT-VIW-01::view.replace. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_view_replace (
  id bigint primary key, label text, extra text
);
