-- Covers PG-CAT-ROL-02::ownership.object. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_ownership_object (
  id bigint primary key, label text
);
