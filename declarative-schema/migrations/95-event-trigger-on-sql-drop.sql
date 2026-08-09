create function public.record_sql_drop()
returns event_trigger
language plpgsql
as $$
begin
  null;
end;
$$;

create event trigger fixture_sql_drop
on sql_drop
execute function public.record_sql_drop();
