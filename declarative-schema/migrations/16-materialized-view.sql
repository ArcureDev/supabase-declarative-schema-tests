create table public.daily_sales (
  id bigint generated always as identity primary key,
  sold_on date not null,
  amount numeric(12, 2) not null
);

create materialized view public.daily_sales_totals as
select sold_on, sum(amount) as total
from public.daily_sales
group by sold_on
with no data;
