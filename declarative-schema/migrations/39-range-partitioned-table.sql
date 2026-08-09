create table public.time_entries (
  id bigint not null,
  recorded_on date not null,
  minutes integer not null,
  constraint time_entries_pkey primary key (id, recorded_on)
) partition by range (recorded_on);
