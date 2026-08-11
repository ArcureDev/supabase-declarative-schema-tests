select jsonb_build_object(
  'identity',
  'public.transition_anchor'::regclass::oid,
  'valid',
  (
    select to_jsonb(anchor_row)
    from public.transition_anchor as anchor_row
    where anchor_row.id = 242
  ) = '{"id":242,"payload":"background-processing"}'::jsonb
  and (
    select
      count(*) = 2
      and bool_and(queued_job.status = 'queued')
      and bool_and(queued_job.attempts = 0)
    from jobs.queue as queued_job
  )
  and to_regprocedure('jobs.claim_next(text,text)') is not null
  and has_function_privilege(
    'authenticated', 'jobs.enqueue(text,jsonb)', 'EXECUTE'
  )
  and not has_function_privilege(
    'authenticated', 'jobs.claim_next(text,text)', 'EXECUTE'
  )
  and has_function_privilege(
    'service_role', 'jobs.claim_next(text,text)', 'EXECUTE'
  )
  and exists (
    select 1
    from pg_trigger
    where tgrelid = 'jobs.dead_letters'::regclass
      and tgname = 'dead_letter_outbox'
      and not tgisinternal
  )
  and (
    select relforcerowsecurity
    from pg_class
    where oid = 'jobs.queue'::regclass
  )
)::text;
