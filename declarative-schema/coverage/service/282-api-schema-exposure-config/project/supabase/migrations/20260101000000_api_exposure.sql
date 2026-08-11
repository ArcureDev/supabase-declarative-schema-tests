-- The custom schema is readable but deliberately grants no write capability.
create schema coverage_api;
create table coverage_api.exposed_items (
  id bigint primary key,
  label text not null
);
insert into coverage_api.exposed_items (id, label)
values (1, 'config-exposed');
grant usage on schema coverage_api to anon, authenticated;
grant select on table coverage_api.exposed_items to anon, authenticated;
