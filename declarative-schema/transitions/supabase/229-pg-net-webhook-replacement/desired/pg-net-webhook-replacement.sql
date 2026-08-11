create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists pg_net with schema extensions;
create table public.webhook_events_229 (
  id bigint generated always as identity primary key,
  payload text not null
);
create function public.notify_transition_229()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform net.http_post(
    url := 'http://127.0.0.1.invalid/transition-229-v2',
    headers := pg_catalog.jsonb_build_object('Content-Type', 'application/json'),
    body := pg_catalog.jsonb_build_object('id', new.id, 'payload', new.payload),
    timeout_milliseconds := 2000
  );
  return new;
end;
$$;
create trigger transition_webhook_229
after insert on public.webhook_events_229
for each row execute function public.notify_transition_229();
