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

insert into public.transition_anchor (case_no, payload)
select
  232,
  jsonb_build_object(
    'function_oid', routine.oid,
    'function_acl', coalesce(to_jsonb(routine.proacl), 'null'::jsonb),
    'extension_oid', extension_catalog.oid,
    'queue_acl', coalesce(to_jsonb(queue_relation.relacl), 'null'::jsonb),
    'archive_acl', coalesce(to_jsonb(archive_relation.relacl), 'null'::jsonb)
  )::text
from pg_proc as routine
cross join pg_extension as extension_catalog
cross join pg_class as queue_relation
cross join pg_class as archive_relation
where routine.oid = 'public.transition_queue_marker_232()'::regprocedure
  and extension_catalog.extname = 'pgmq'
  and queue_relation.oid = 'pgmq.q_transition_232'::regclass
  and archive_relation.oid = 'pgmq.a_transition_232'::regclass;
