-- Simulates the durable checkpoint left before a command was interrupted.
create table public.coverage_recovery_contract (
  id bigint primary key,
  payload text not null,
  checkpoint integer
);

-- Keep the apply transaction open long enough for interrupt-sync.mts to stop
-- the real CLI process. The runner removes this trigger before retrying.
create function public.coverage_delay_alter_table()
returns event_trigger
language plpgsql
as $$
begin
  perform pg_sleep(20);
end
$$;

create event trigger coverage_delay_alter_table
  on ddl_command_end
  when tag in ('ALTER TABLE')
  execute function public.coverage_delay_alter_table();
