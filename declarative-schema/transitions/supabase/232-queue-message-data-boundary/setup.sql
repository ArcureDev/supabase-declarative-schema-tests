insert into public.transition_anchor (case_no, payload)
values (232, 'case-232');

select pgmq.create('transition_232');
with sent as (
  select pgmq.send('transition_232', '{"case":232}'::jsonb) as message_id
)
insert into public.queue_guard_232 (id, queue_oid, archive_oid, message_id)
select
  1,
  'pgmq.q_transition_232'::regclass::oid,
  'pgmq.a_transition_232'::regclass::oid,
  sent.message_id
from sent;
