create table public.orders (
  id bigint generated always as identity primary key,
  total numeric(12, 2) not null
);

create view public.positive_orders as
select id, total
from public.orders
where total > 0;
