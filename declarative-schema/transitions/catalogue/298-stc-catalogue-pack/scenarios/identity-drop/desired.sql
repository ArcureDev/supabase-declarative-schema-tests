-- Covers PG-CAT-STC-07::identity.drop. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_identity_drop (
  id bigint primary key, label text, extra text
);
