create type public.measurement_row as (
  observed_at timestamptz,
  measured_value double precision
);

create table public.measurements of public.measurement_row;
