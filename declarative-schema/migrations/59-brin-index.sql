create table public.event_stream (
  id bigint generated always as identity primary key,
  recorded_at timestamptz not null
);

create index event_stream_recorded_at_brin_idx
on public.event_stream using brin (recorded_at);
