-- Covers PG-CAT-RTN-04::procedure.replace. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_procedure_replace (
  id bigint primary key, label text, extra text
);
