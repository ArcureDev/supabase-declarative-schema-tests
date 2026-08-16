-- Covers PG-CAT-PRT-04::partition.attach-invalid. Keep public.transition_anchor identity stable. This atom is an explicit supported/unsupported boundary, not an accidental omission.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_probe (
  id bigint primary key, label text
);
-- Desired change for partition.attach-invalid must be refused, not silently omitted.
