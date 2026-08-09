create table public.secure_orders (
  id bigint generated always as identity primary key,
  owner_id uuid not null,
  total numeric(12, 2) not null
);

create view public.secure_orders_view
with (security_invoker = true) as
select id, owner_id, total
from public.secure_orders;
