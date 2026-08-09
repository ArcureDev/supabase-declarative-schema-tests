create table public.order_lines (
  id bigint generated always as identity primary key,
  order_id bigint not null,
  position integer not null,
  sku text not null
);

create index order_lines_order_id_position_idx
on public.order_lines (order_id, position);
