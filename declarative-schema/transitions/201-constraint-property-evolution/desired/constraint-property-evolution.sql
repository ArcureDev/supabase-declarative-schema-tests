create table public.transition_anchor (
  id integer primary key,
  payload text not null
);

create table public.constraint_accounts (
  id bigint not null,
  tenant_id bigint not null,
  code text,
  amount numeric not null,
  constraint constraint_accounts_pkey primary key (id),
  constraint constraint_accounts_tenant_code_key
    unique nulls not distinct (tenant_id, code)
    deferrable initially deferred,
  constraint constraint_accounts_amount_range
    check (amount between 0 and 10000)
);
