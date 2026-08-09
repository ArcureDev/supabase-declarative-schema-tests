create table public.catalog_entries (
  id bigint generated always as identity primary key,
  sku text not null
);

create index catalog_entries_sku_idx
on public.catalog_entries using btree (sku);
