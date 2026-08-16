-- Covers PG-CAT-VIW-02::view.incompatible. Keep public.transition_anchor identity stable. This atom is an explicit supported/unsupported boundary, not an accidental omission.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_probe (
  id bigint primary key, label text
);
-- Desired change for view.incompatible must be refused, not silently omitted.
