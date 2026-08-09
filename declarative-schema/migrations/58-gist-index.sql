create table public.booking_windows (
  id bigint generated always as identity primary key,
  active_during tstzrange not null
);

create index booking_windows_active_during_gist_idx
on public.booking_windows using gist (active_during);
