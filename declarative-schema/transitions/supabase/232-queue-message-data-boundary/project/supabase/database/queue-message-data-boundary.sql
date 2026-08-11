create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists pgmq;
create table public.queue_guard_232 (
  id integer primary key,
  queue_oid oid not null,
  archive_oid oid not null,
  message_id bigint not null
);
create function public.transition_queue_marker_232()
returns text
language sql
immutable
set search_path = ''
as $$ select 'v1'::text $$;
