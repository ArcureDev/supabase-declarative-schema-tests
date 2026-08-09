create table public.renamed_index_items (
  id bigint generated always as identity primary key,
  code text not null
);

create index renamed_index_items_code_tmp_idx
on public.renamed_index_items (code);

alter index public.renamed_index_items_code_tmp_idx
  rename to renamed_index_items_code_idx;
