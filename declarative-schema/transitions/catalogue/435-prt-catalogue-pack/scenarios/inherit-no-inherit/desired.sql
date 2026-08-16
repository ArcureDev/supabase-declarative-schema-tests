-- Covers PG-CAT-PRT-06::inherit.no-inherit. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_inherit_no_inherit (
  id bigint primary key, label text, extra text
);
