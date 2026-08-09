create schema if not exists extensions;

create extension if not exists pg_net
with schema extensions;

create table public.webhook_events (
  id bigint generated always as identity primary key,
  payload text not null
);

create function public.notify_webhook_events()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  perform net.http_post(
    url := 'http://localhost:54321/functions/v1/webhook',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object('id', new.id, 'payload', new.payload)
  );
  return new;
end;
$$;

create trigger webhook_events_after_insert
after insert on public.webhook_events
for each row
execute function public.notify_webhook_events();
