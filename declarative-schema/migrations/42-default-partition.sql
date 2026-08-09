create table public.sensor_readings (
  id bigint not null,
  recorded_on date not null,
  value numeric not null,
  constraint sensor_readings_pkey primary key (id, recorded_on)
) partition by range (recorded_on);

create table public.sensor_readings_default
partition of public.sensor_readings
default;
