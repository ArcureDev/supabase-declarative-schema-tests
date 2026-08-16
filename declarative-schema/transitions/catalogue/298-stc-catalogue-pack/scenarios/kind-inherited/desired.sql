-- Covers PG-CAT-STC-02::kind.inherited. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_kind_inherited (
  id bigint primary key, label text
);
