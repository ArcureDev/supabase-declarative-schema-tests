create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create table public.webhook_events_263 (
  id bigint primary key,
  payload text not null,
  deliver boolean not null default true
);

create table public.webhook_identity_263 (
  id integer primary key,
  table_oid oid not null,
  function_oid oid not null,
  trigger_oid oid not null
);

create function public.dispatch_webhook_263()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform net.http_post(
    url := 'http://127.0.0.1:1/mock/263-v1',
    body := pg_catalog.jsonb_build_object('id', new.id),
    timeout_milliseconds := 250
  );
  return new;
end;
$$;

create trigger webhook_lifecycle_263
after insert on public.webhook_events_263
for each row execute function public.dispatch_webhook_263();
