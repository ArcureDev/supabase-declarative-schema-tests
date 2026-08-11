create table public.coverage_order_items (
  id bigint generated always as identity primary key,
  state public.coverage_order_state not null
);
