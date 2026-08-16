-- Covers PG-CAT-RTN-06::trigger.instead-of. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_trigger_instead_of (
  id bigint primary key, label text, extra text
);
