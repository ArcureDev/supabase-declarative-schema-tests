select jsonb_build_object(
          'identity',
          'public.transition_anchor'::regclass::oid,
          'valid',
          (
            select count(*) = 1
              and bool_and(case_no = 232 and payload = 'case-232')
            from public.transition_anchor
          )
          and (
        public.transition_queue_marker_232() = 'v1'
and exists (
  select 1 from public.queue_guard_232
  where id = 1
    and queue_oid = 'pgmq.q_transition_232'::regclass::oid
    and archive_oid = 'pgmq.a_transition_232'::regclass::oid
)
and (
  select count(*) = 1 and bool_and(message = '{"case":232}'::jsonb)
  from pgmq.q_transition_232
)
          )
        )::text;
