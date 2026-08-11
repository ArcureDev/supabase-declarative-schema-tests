select jsonb_build_object(
  'identity',
  (
    select oid
    from pg_policy
    where polrelid = 'realtime.messages'::regclass
      and polname = 'transition_realtime_receive_228'
  ),
  'valid',
  (
    select count(*) = 1
      and bool_and(
        case_no = 228
        and (payload::jsonb ->> 'messages_oid')::oid =
          'realtime.messages'::regclass::oid
        and (payload::jsonb ->> 'policy_oid')::oid = (
          select oid
          from pg_policy
          where polrelid = 'realtime.messages'::regclass
            and polname = 'transition_realtime_receive_228'
        )
        and (payload::jsonb ->> 'messages_owner')::oid = (
          select relowner from pg_class where oid = 'realtime.messages'::regclass
        )
        and payload::jsonb -> 'messages_acl' = (
          select coalesce(to_jsonb(relacl), 'null'::jsonb)
          from pg_class
          where oid = 'realtime.messages'::regclass
        )
      )
    from public.transition_anchor
  )
  and (
    select relrowsecurity
    from pg_class
    where oid = 'realtime.messages'::regclass
  )
  and (
    select count(*) = 1
      and bool_and(
        polcmd = 'r'
        and polpermissive
        and polroles = array[
          (select oid from pg_roles where rolname = 'authenticated')
        ]::oid[]
        and polwithcheck is null
        and pg_get_expr(polqual, polrelid) ilike '%realtime.topic%'
        and pg_get_expr(polqual, polrelid) ilike '%transition:public%'
        and pg_get_expr(polqual, polrelid) not ilike '%auth.uid%'
      )
    from pg_policy
    where polrelid = 'realtime.messages'::regclass
      and polname = 'transition_realtime_receive_228'
  )
)::text;
