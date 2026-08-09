create table public.product_prices (
  id bigint generated always as identity primary key,
  sku text not null,
  price numeric(12, 2) not null,
  currency text not null
);

create index product_prices_sku_covering_idx
on public.product_prices (sku)
include (price, currency);
