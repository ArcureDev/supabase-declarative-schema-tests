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
    from jobs.queue as queued_job
  )
  and (select count(*) = 1 from jobs.schedules)
)::text;
