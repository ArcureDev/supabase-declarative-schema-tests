-- Declarative ownership stops at table shape; rows remain runtime data.
create table public.coverage_schema_data (
  id bigint primary key,
  payload text not null,
  created_at timestamptz not null default now()
);
