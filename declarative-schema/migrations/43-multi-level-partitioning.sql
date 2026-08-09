create table public.metric_samples (
  id bigint not null,
  recorded_on date not null,
  region_code text not null,
  value numeric not null,
  constraint metric_samples_pkey primary key (id, recorded_on, region_code)
) partition by range (recorded_on);

create table public.metric_samples_2024
partition of public.metric_samples
for values from ('2024-01-01') to ('2025-01-01')
partition by list (region_code);

create table public.metric_samples_2024_eu
partition of public.metric_samples_2024
for values in ('eu');
