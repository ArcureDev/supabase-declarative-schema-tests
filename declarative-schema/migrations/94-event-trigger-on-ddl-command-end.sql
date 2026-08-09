create function public.record_ddl_command_end()
returns event_trigger
language plpgsql
as $$
begin
  null;
end;
$$;

create event trigger fixture_ddl_command_end
on ddl_command_end
execute function public.record_ddl_command_end();
