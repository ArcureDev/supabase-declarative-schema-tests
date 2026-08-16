-- Covers PG-CAT-VIW-02::view.recursive. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_view_recursive (
  id bigint primary key, label text, extra text
);
