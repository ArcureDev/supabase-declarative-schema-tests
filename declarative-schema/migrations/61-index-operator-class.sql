create table public.searchable_names (
  id bigint generated always as identity primary key,
  name text not null
);

create index searchable_names_name_pattern_idx
on public.searchable_names (name text_pattern_ops);
