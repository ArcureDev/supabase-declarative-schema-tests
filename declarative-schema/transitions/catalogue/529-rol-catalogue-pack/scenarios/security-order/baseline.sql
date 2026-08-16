-- Covers PG-CAT-ROL-07::security.order. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_security_order (
  id bigint primary key, label text
);
