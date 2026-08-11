create table public.coverage_recovery_contract (
  id bigint primary key,
  payload text not null,
  checkpoint integer not null default 0,
  completed_at timestamptz
);
create unique index coverage_recovery_contract_payload_idx
  on public.coverage_recovery_contract (lower(payload));
