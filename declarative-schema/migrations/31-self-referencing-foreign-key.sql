create table public.categories (
  id bigint generated always as identity primary key,
  parent_category_id bigint,
  name text not null,
  constraint categories_parent_category_id_fkey
    foreign key (parent_category_id)
    references public.categories (id)
);
