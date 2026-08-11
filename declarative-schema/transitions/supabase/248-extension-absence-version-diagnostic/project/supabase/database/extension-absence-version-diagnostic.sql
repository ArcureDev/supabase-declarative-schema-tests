create schema if not exists extensions;

create extension if not exists hstore
with schema extensions;

create table public.transition_anchor_248 (
  case_no integer primary key,
  payload text not null
);

create table public.extension_snapshot_248 (
  id integer primary key,
  extension_oid oid not null,
  installed_version text not null
);
