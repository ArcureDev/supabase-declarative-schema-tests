-- Covers PG-CAT-EXT-04::fdw.redaction. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_fdw_redaction (
  id bigint primary key, label text
);
