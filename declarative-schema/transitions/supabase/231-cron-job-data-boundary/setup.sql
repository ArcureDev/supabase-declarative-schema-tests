with scheduled_job as (
  select cron.schedule(
    'transition-231',
    '0 0 1 1 *',
    'select public.transition_cron_task_231()'
  ) as job_id
)
insert into public.transition_anchor (case_no, payload)
select
  231,
  jsonb_build_object(
    'function_oid', routine.oid,
    'function_acl', coalesce(to_jsonb(routine.proacl), 'null'::jsonb),
    'job_id', scheduled_job.job_id,
    'extension_oid', extension_catalog.oid
  )::text
from scheduled_job
cross join pg_proc as routine
cross join pg_extension as extension_catalog
where routine.oid = 'public.transition_cron_task_231()'::regprocedure
  and extension_catalog.extname = 'pg_cron';
