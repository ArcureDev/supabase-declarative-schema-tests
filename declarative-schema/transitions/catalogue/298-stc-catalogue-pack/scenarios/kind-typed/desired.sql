-- Covers PG-CAT-STC-02::kind.typed. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_kind_typed (
  id bigint primary key, label text
);
