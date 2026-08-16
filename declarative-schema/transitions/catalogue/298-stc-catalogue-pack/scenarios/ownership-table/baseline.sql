-- Covers PG-CAT-STC-02::ownership.table. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_ownership_table (
  id bigint primary key, label text
);
