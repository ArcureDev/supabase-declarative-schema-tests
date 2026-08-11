create table public.config_anchor_247 (
  case_no integer primary key,
  payload text not null
);

comment on table public.config_anchor_247
is 'application object retained across platform config startup';

create table public.config_snapshot_247 (
  id integer primary key,
  anchor_oid oid not null,
  auth_users_oid oid not null,
  storage_objects_oid oid not null,
  server_major integer not null
);
