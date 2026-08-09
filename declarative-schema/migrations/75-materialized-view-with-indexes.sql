create table public.weekly_sales (
  id bigint generated always as identity primary key,
  week_start date not null,
  amount numeric(12, 2) not null
);

create materialized view public.weekly_sales_totals as
select week_start, sum(amount) as total
from public.weekly_sales
group by week_start
with no data;

create unique index weekly_sales_totals_week_start_uidx
on public.weekly_sales_totals (week_start);
