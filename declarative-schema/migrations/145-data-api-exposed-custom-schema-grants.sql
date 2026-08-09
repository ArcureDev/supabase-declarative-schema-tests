create schema api_exposed;

create table api_exposed.exposed_items (
  id bigint generated always as identity primary key,
  title text not null
);

grant usage on schema api_exposed to anon, authenticated;
grant select on table api_exposed.exposed_items to anon, authenticated;
