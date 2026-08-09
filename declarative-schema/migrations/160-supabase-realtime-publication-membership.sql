create table public.realtime_items (
  id bigint generated always as identity primary key,
  payload text not null
);

alter publication supabase_realtime add table public.realtime_items;
