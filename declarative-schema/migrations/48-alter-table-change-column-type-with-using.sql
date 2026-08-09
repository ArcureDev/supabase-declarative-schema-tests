create table public.measurement_logs (
  id bigint generated always as identity primary key,
  reading text not null
);

alter table public.measurement_logs
  alter column reading type integer
  using reading::integer;
