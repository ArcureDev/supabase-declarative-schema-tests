-- File names oppose dependency order; the planner must order by catalog edges.
create view public.coverage_order_summary as
select state, count(*)::bigint as item_count
from public.coverage_order_items
group by state;
