-- Covers PG-CAT-STC-03::batch.columns@populated. Keep public.transition_anchor identity stable.
create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.catalogue_batch_columns_at_populated (
  id bigint primary key, label text, extra text
);
