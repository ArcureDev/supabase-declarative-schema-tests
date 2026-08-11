create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create table public.storage_helper_probe_256 (
  id integer primary key,
  object_name text not null,
  helper_oid oid
);

create function public.storage_path_facts_256(path text)
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select pg_catalog.jsonb_build_object(
    'filename', storage.filename(path),
    'extension', storage.extension(path)
  )
$$;

revoke execute on function public.storage_path_facts_256(text)
from public, anon;
grant execute on function public.storage_path_facts_256(text)
to authenticated;
