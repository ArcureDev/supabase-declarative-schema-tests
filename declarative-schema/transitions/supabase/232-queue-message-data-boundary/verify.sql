select jsonb_build_object(
  'identity',
  'public.transition_queue_marker_232()'::regprocedure::oid,
  'valid',
  (
    select count(*) = 1
      and bool_and(
        case_no = 232
        and (payload::jsonb ->> 'function_oid')::oid =
          'public.transition_queue_marker_232()'::regprocedure::oid
        and (payload::jsonb ->> 'extension_oid')::oid = (
          select oid from pg_extension where extname = 'pgmq'
        )
        and payload::jsonb -> 'function_acl' = (
          select coalesce(to_jsonb(proacl), 'null'::jsonb)
          from pg_proc
          where oid = 'public.transition_queue_marker_232()'::regprocedure
        )
        and payload::jsonb -> 'queue_acl' = (
          select coalesce(to_jsonb(relacl), 'null'::jsonb)
          from pg_class
          where oid = 'pgmq.q_transition_232'::regclass
        )
        and payload::jsonb -> 'archive_acl' = (
          select coalesce(to_jsonb(relacl), 'null'::jsonb)
          from pg_class
          where oid = 'pgmq.a_transition_232'::regclass
        )
      )
    from public.transition_anchor
  )
  and (
    select not prosecdef
      and provolatile = 'i'
      and prorettype = 'text'::regtype
      and language.lanname = 'sql'
      and array_to_string(proconfig, ',') ilike '%search_path=%'
    from pg_proc as routine
    join pg_language as language on language.oid = routine.prolang
    where routine.oid = 'public.transition_queue_marker_232()'::regprocedure
  )
  and public.transition_queue_marker_232() = 'v2'
  and exists (
    select 1
    from public.queue_guard_232
    where id = 1
      and queue_oid = 'pgmq.q_transition_232'::regclass::oid
      and archive_oid = 'pgmq.a_transition_232'::regclass::oid
  )
  and (
    select count(*) = 1
      and bool_and(
        msg_id = (
          select message_id from public.queue_guard_232 where id = 1
        )
        and read_ct = 0
        and message = '{"case":232}'::jsonb
      )
    from pgmq.q_transition_232
  )
  and (select count(*) = 0 from pgmq.a_transition_232)
)::text;
