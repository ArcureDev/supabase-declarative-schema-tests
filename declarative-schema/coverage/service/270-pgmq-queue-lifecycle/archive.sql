-- Invariant: one read/archive transition preserves the exact message payload.
with message as (
  select * from pgmq.read('coverage_270', 30, 1)
), archived as (
  select pgmq.archive('coverage_270', msg_id) as archived
  from message
)
select jsonb_build_object(
  'valid',
    (select count(*) = 1 and bool_and(message = '{"case":270,"state":"queued"}'::jsonb)
     from message)
    and (select bool_and(archived) from archived)
)::text;
