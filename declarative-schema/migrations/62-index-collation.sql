create table public.localized_titles (
  id bigint generated always as identity primary key,
  title text not null
);

create index localized_titles_title_c_idx
on public.localized_titles (title collate "C");
