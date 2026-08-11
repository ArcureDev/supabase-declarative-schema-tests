create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create table public.realtime_policy_identity_260 (
  policy_name text primary key,
  policy_oid oid not null
);

create policy realtime_receive_260
on realtime.messages for select to authenticated
using (
  extension in ('broadcast', 'presence')
  and realtime.topic() like 'team:%'
);

create policy realtime_send_260
on realtime.messages for insert to authenticated
with check (
  extension in ('broadcast', 'presence')
  and realtime.topic() like 'team:%'
);
