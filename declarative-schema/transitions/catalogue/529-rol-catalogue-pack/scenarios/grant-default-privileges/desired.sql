-- Covers PG-CAT-ROL-04::grant.default-privileges. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_grant_default_privileges (
  id bigint primary key, label text, extra text
);
