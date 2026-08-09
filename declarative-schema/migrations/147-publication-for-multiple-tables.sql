create table public.publication_alpha (
  id bigint generated always as identity primary key,
  payload text not null
);

create table public.publication_beta (
  id bigint generated always as identity primary key,
  payload text not null
);

create publication fixture_multi_table_publication
for table public.publication_alpha, public.publication_beta;
