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
    unique (tenant_id, code) deferrable initially immediate,
  constraint constraint_accounts_amount_nonnegative check (amount >= 0)
);
