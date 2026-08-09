create table public.replica_widgets (
  id bigint generated always as identity primary key,
  label text not null
);

alter table public.replica_widgets replica identity full;
