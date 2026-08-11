create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create table public.database_webhook_events_297 (
  id bigint generated always as identity primary key,
  payload jsonb not null
);

create trigger database_webhook_297
after insert or update on public.database_webhook_events_297
for each row
execute function supabase_functions.http_request(
  'http://127.0.0.1:1/database-webhook-297',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);
