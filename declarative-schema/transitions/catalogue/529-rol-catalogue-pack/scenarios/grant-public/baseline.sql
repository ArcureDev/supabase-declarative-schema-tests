-- Covers PG-CAT-ROL-04::grant.public. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_grant_public (
  id bigint primary key, label text
);
