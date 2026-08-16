-- Covers PG-CAT-ROL-03::grant.routine. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_grant_routine (
  id bigint primary key, label text
);
