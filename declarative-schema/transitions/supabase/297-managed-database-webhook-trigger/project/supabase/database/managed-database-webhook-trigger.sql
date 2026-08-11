create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create table public.database_webhook_events_297 (
  id bigint generated always as identity primary key,
  payload jsonb not null
);
