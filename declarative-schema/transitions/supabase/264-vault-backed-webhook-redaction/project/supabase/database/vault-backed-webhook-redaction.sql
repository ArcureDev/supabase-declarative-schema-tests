create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create table public.vault_webhook_events_264 (
  id bigint primary key,
  payload text not null
);

create table public.vault_webhook_identity_264 (
  id integer primary key,
  table_oid oid not null,
  function_oid oid not null,
  trigger_oid oid not null
);

create function public.dispatch_vault_webhook_264()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  token text;
begin
  select decrypted_secret into token
  from vault.decrypted_secrets
  where name = 'webhook_264_token';

  perform net.http_post(
    url := 'http://127.0.0.1:1/mock/264-v1',
    headers := pg_catalog.jsonb_build_object('authorization', 'Bearer ' || token),
    body := pg_catalog.jsonb_build_object('id', new.id),
    timeout_milliseconds := 250
  );
  return new;
end;
$$;

revoke execute on function public.dispatch_vault_webhook_264()
from public, anon, authenticated;

create trigger vault_webhook_264
after insert on public.vault_webhook_events_264
for each row execute function public.dispatch_vault_webhook_264();
