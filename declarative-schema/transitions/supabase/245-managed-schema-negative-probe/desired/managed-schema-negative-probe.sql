create table public.transition_anchor_245 (
  case_no integer primary key,
  payload text not null
);

create table public.managed_guard_245 (
  id bigint generated always as identity primary key,
  label text not null,
  hardened boolean not null default true
);

create table public.managed_snapshot_245 (
  id integer primary key,
  auth_users_oid oid not null,
  auth_schema_oid oid not null
);

-- This object is intentionally inside a platform-owned schema and must be ignored.
create table auth.ds_managed_negative_245 (
  id uuid primary key
);
