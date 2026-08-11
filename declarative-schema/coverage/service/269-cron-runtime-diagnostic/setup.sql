-- Invariant: Cron schedules are runtime rows, not declarative DDL.
create extension if not exists pg_cron with schema pg_catalog;
select cron.unschedule(jobid) from cron.job where jobname = 'coverage-269';

create function public.cron_diagnostic_269()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select pg_catalog.jsonb_build_object(
    'jobname', jobname,
    'schedule', schedule,
    'active', active,
    'command', command
  )
  from cron.job
  where jobname = 'coverage-269'
$$;
revoke execute on function public.cron_diagnostic_269()
from public, anon, authenticated;
grant execute on function public.cron_diagnostic_269()
to service_role;

select cron.schedule(
  'coverage-269',
  '0 0 1 1 *',
  'select 269'
);
notify pgrst, 'reload schema';
select pg_sleep(1);

select jsonb_build_object(
  'valid',
  exists (
    select 1 from cron.job
    where jobname = 'coverage-269'
      and schedule = '0 0 1 1 *'
      and command = 'select 269'
      and active
  )
  and not has_function_privilege('anon', 'public.cron_diagnostic_269()', 'EXECUTE')
)::text;
