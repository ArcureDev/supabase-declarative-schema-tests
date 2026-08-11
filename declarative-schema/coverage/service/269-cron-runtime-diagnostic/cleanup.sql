-- Invariant: cleanup removes the schedule without changing diagnostic DDL.
select cron.unschedule(jobid) from cron.job where jobname = 'coverage-269';
select jsonb_build_object(
  'valid',
  not exists (select 1 from cron.job where jobname = 'coverage-269')
)::text;
