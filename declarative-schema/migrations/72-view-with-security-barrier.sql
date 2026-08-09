create table public.barrier_accounts (
  id bigint generated always as identity primary key,
  balance numeric(12, 2) not null
);

create view public.barrier_accounts_view
with (security_barrier = true) as
select id, balance
from public.barrier_accounts
where balance >= 0;
