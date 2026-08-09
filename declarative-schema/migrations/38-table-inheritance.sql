create table public.content_items (
  id bigint not null,
  title text not null,
  published_at timestamptz
);

create table public.articles (
  body text not null
) inherits (public.content_items);
