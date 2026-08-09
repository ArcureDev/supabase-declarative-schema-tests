create table public.invoice_lines (
  id bigint generated always as identity primary key,
  quantity integer not null,
  unit_price numeric(12, 2) not null,
  line_total numeric(14, 2)
    generated always as (quantity * unit_price) stored
);
