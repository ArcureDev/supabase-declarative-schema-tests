-- Covers PG-CAT-VIW-03::view.dependency-order. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_view_dependency_order (
  id bigint primary key, label text
);
