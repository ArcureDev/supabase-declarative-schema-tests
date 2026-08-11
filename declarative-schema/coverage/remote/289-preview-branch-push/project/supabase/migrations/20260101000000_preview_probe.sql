-- Dry-run only: this migration must never be applied by the coverage fixture.
create table if not exists public.coverage_preview_probe (
  id bigint primary key,
  checked_at timestamptz not null default now()
);
