create table public.products (
  id bigint generated always as identity primary key,
  name text not null,
  price numeric(12, 2) not null,
  constraint products_positive_price check (price > 0)
);
