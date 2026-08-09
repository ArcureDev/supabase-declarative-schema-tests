create table public.tablespace_indexed_items (
  id bigint generated always as identity primary key,
  code text not null
);

create index tablespace_indexed_items_code_idx
on public.tablespace_indexed_items (code)
tablespace pg_default;
