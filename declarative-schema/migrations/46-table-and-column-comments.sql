create table public.documented_items (
  id bigint generated always as identity primary key,
  title text not null
);

comment on table public.documented_items is 'Items with documented metadata.';
comment on column public.documented_items.title is 'Human-readable item title.';
