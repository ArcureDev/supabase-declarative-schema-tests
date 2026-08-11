-- The second migration gives repair and squash a real history edge.
alter table public.coverage_repair_probe
  add column revision integer not null default 1;
create index coverage_repair_probe_payload_idx
  on public.coverage_repair_probe (payload);
