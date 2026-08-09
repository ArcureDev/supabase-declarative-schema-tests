create table public.constrained_balances (
  id bigint generated always as identity primary key,
  amount numeric(12, 2) not null
);

create function public.reject_negative_constrained_balance()
returns trigger
language plpgsql
as $$
begin
  if new.amount < 0 then
    raise exception 'amount must be non-negative';
  end if;
  return new;
end;
$$;

create constraint trigger constrained_balances_non_negative
after insert or update on public.constrained_balances
deferrable initially deferred
for each row
execute function public.reject_negative_constrained_balance();
