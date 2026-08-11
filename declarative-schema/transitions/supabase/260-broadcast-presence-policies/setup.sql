-- Invariant: policy hardening preserves policy OIDs and role scope.
insert into public.transition_anchor values (260, 'broadcast-presence-policies');
insert into public.realtime_policy_identity_260
select polname, oid
from pg_policy
where polrelid = 'realtime.messages'::regclass
  and polname in ('realtime_receive_260', 'realtime_send_260');
