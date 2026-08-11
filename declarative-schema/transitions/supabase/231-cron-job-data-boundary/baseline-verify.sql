select jsonb_build_object(
          'identity',
          'public.transition_anchor'::regclass::oid,
          'valid',
          (
            select count(*) = 1
              and bool_and(case_no = 231 and payload = 'case-231')
            from public.transition_anchor
          )
          and (
        public.transition_cron_task_231() = 'v1'
and exists (
  select 1 from cron.job
  where jobname = 'transition-231'
    and schedule = '0 0 1 1 *'
    and command = 'select public.transition_cron_task_231()'
    and active
)
          )
        )::text;
