create table public.clustered_rows (
  id bigint generated always as identity primary key,
  group_key text not null
);

create index clustered_rows_group_key_idx
on public.clustered_rows (group_key);

cluster public.clustered_rows using clustered_rows_group_key_idx;
