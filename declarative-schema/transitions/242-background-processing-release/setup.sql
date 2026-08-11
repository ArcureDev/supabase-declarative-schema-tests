insert into public.transition_anchor (id, payload)
values (242, 'background-processing');

insert into jobs.schedules (
  name,
  cron_expression,
  command_name,
  enabled
)
values (
  'retry-worker',
  '*/5 * * * *',
  'jobs.claim_next',
  true
);

insert into jobs.secret_refs (name, secret_id)
values (
  'worker-token',
  '24200000-0000-0000-0000-000000000001'
);

select jobs.enqueue(
  'email',
  '{"recipient":"local@example.test"}'::jsonb
);

select jobs.enqueue(
  'email',
  '{"recipient":"retry@example.test"}'::jsonb
);
