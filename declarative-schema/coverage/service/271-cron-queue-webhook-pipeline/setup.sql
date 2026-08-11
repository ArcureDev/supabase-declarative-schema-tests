-- Invariant: the webhook target is loopback-invalid, so no external network is reachable.
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pgmq;
create extension if not exists pg_net with schema extensions;
select cron.unschedule(jobid) from cron.job where jobname = 'coverage-271';
select pgmq.create('pipeline_271');

create table public.pipeline_audit_271 (
  id bigint generated always as identity primary key,
  message_id bigint not null,
  request_id bigint not null,
  created_at timestamptz not null default now()
);

create function public.pipeline_dispatch_271()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  queued_message_id bigint;
  webhook_request_id bigint;
begin
  queued_message_id := pgmq.send(
    'pipeline_271',
    pg_catalog.jsonb_build_object('case', 271, 'source', 'cron')
  );
  webhook_request_id := net.http_post(
    url := 'http://127.0.0.1:1/mock/webhook-271',
    headers := pg_catalog.jsonb_build_object(
      'authorization',
      'Bearer PIPELINE_LOCAL_TOKEN_271'
    ),
    body := pg_catalog.jsonb_build_object(
      'case', 271,
      'message_id', queued_message_id
    ),
    timeout_milliseconds := 250
  );
  insert into public.pipeline_audit_271 (message_id, request_id)
  values (queued_message_id, webhook_request_id);
  return pg_catalog.jsonb_build_object(
    'queued', true,
    'message_id', queued_message_id,
    'request_id', webhook_request_id
  );
end;
$$;

revoke execute on function public.pipeline_dispatch_271()
from public, anon, authenticated;
grant execute on function public.pipeline_dispatch_271()
to service_role;

select cron.schedule(
  'coverage-271',
  '0 0 1 1 *',
  'select public.pipeline_dispatch_271()'
);
notify pgrst, 'reload schema';
select pg_sleep(1);

select jsonb_build_object(
  'valid',
    exists (
      select 1 from cron.job
      where jobname = 'coverage-271'
        and command = 'select public.pipeline_dispatch_271()'
        and active
    )
    and to_regclass('pgmq.q_pipeline_271') is not null
    and not has_function_privilege('anon', 'public.pipeline_dispatch_271()', 'EXECUTE')
)::text;
