-- Invariant: application objects may compose extensions without owning versions.
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists pg_trgm with schema extensions;
create extension if not exists unaccent with schema extensions;

create table public.extension_versions_280 (
  extname text primary key,
  extversion text not null
);
create table public.extension_items_280 (
  id uuid primary key default extensions.gen_random_uuid(),
  external_id uuid not null default extensions.uuid_generate_v4(),
  label text not null
);
create function public.normalize_label_280(value text)
returns text
language sql
stable
strict
set search_path = ''
as $function$
  select extensions.unaccent(value)
$function$;
revoke execute on function public.normalize_label_280(text) from public, anon;
grant execute on function public.normalize_label_280(text) to authenticated;
