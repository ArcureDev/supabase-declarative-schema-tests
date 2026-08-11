create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create policy transition_realtime_receive_228
on realtime.messages
for select
to authenticated
using (
  (select realtime.topic()) = 'transition:' || (select auth.uid())::text
);
