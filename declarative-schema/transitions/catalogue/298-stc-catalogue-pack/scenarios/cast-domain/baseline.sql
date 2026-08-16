-- Covers PG-CAT-STC-04::cast.domain. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_cast_domain (
  id bigint primary key, label text
);
