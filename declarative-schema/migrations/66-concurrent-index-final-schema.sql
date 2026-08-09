create table public.concurrent_index_targets (
  id bigint generated always as identity primary key,
  label text not null
);

create index concurrent_index_targets_label_idx
on public.concurrent_index_targets (label);
