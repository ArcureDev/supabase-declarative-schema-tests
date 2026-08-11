create table public.transition_anchor (
  id bigint generated always as identity primary key,
  label text not null
);

create table public.transition_ddl_log (
  id bigint generated always as identity primary key,
  entry text not null
);

create function public.transition_record_ddl()
returns event_trigger
language plpgsql
as $$
begin
  insert into public.transition_ddl_log (entry)
  values ('v2:' || tg_tag);
end
$$;

create event trigger transition_ddl_watch
on ddl_command_end
when tag in ('CREATE TABLE')
execute function public.transition_record_ddl();
