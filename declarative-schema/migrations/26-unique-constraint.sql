create table public.usernames (
  id bigint generated always as identity primary key,
  username text not null,
  constraint usernames_username_key unique (username)
);
