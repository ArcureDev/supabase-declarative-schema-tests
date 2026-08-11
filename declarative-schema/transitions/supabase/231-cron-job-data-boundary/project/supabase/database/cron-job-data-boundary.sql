create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists pg_cron with schema pg_catalog;
create function public.transition_cron_task_231()
returns text
language sql
stable
set search_path = ''
as $$ select 'v1'::text $$;
