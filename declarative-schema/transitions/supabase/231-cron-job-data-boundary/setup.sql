insert into public.transition_anchor (case_no, payload)
values (231, 'case-231');

select cron.schedule(
  'transition-231',
  '0 0 1 1 *',
  'select public.transition_cron_task_231()'
);
