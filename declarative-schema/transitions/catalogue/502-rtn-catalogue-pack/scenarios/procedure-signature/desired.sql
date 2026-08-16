-- Covers PG-CAT-RTN-04::procedure.signature. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_procedure_signature (
  id bigint primary key, label text, extra text
);
