-- Invariant: cleanup removes runtime schedule and queue relations only.
select cron.unschedule(jobid) from cron.job where jobname = 'coverage-271';
select pgmq.drop_queue('pipeline_271');
select jsonb_build_object(
  'valid',
    not exists (select 1 from cron.job where jobname = 'coverage-271')
    and to_regclass('pgmq.q_pipeline_271') is null
    and (select count(*) = 1 from public.pipeline_audit_271)
)::text;
