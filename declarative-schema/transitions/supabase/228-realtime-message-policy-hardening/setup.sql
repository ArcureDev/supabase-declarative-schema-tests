insert into public.transition_anchor (case_no, payload)
select
  228,
  jsonb_build_object(
    'messages_oid', messages.oid,
    'messages_owner', messages.relowner,
    'messages_acl', coalesce(to_jsonb(messages.relacl), 'null'::jsonb),
    'policy_oid', policy.oid
  )::text
from pg_class as messages
cross join pg_policy as policy
where messages.oid = 'realtime.messages'::regclass
  and policy.polrelid = messages.oid
  and policy.polname = 'transition_realtime_receive_228';
