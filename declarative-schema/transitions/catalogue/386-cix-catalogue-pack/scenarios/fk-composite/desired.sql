-- Covers PG-CAT-CIX-02::fk.composite. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_fk_composite (
  id bigint primary key, label text, extra text
);
