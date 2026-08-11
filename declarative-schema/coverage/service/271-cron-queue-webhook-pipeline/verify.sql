-- Invariant: one dispatch links Cron metadata, queue data, and a pg_net request ID.
select jsonb_build_object(
  'valid',
    exists (
      select 1 from cron.job
      where jobname = 'coverage-271'
        and command = 'select public.pipeline_dispatch_271()'
        and active
    )
    and (
      select count(*) = 1
        and bool_and(message = '{"case":271,"source":"cron"}'::jsonb)
      from pgmq.q_pipeline_271
    )
    and (
      select count(*) = 1
        and bool_and(message_id > 0)
        and bool_and(request_id > 0)
      from public.pipeline_audit_271
    )
    and pg_get_functiondef('public.pipeline_dispatch_271()'::regprocedure)
      ilike '%http://127.0.0.1:1/mock/webhook-271%'
    and not has_function_privilege('authenticated', 'public.pipeline_dispatch_271()', 'EXECUTE')
)::text;
