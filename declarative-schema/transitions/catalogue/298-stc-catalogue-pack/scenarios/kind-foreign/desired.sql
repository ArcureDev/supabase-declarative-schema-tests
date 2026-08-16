-- Covers PG-CAT-STC-02::kind.foreign. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_kind_foreign (
  id bigint primary key, label text
);
