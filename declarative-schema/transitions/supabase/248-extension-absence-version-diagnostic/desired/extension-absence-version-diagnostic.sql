create schema if not exists extensions;

-- Deliberately unavailable: the fixture requires a stable version diagnostic.
create extension hstore
with schema extensions
version '0.0.0-ds-missing-248';

create table public.transition_anchor_248 (
  case_no integer primary key,
  payload text not null
);

create table public.extension_snapshot_248 (
  id integer primary key,
  extension_oid oid not null,
  installed_version text not null
);
