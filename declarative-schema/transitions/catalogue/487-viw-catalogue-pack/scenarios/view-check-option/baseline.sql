-- Covers PG-CAT-VIW-01::view.check-option. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_view_check_option (
  id bigint primary key, label text
);
