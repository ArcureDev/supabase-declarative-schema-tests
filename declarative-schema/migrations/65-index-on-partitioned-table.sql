create table public.partitioned_events (
  id bigint not null,
  recorded_on date not null,
  payload text not null,
  constraint partitioned_events_pkey primary key (id, recorded_on)
) partition by range (recorded_on);

create index partitioned_events_payload_idx
on public.partitioned_events (payload);
