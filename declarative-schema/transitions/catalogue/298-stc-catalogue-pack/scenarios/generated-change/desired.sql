-- Covers PG-CAT-STC-07::generated.change. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_generated_change (
  id bigint primary key, label text, extra text
);
