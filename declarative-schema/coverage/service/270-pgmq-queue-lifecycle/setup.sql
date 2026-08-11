-- Invariant: queue relations are extension-managed runtime state.
create extension if not exists pgmq;
select pgmq.create('coverage_270');

create function public.queue_enqueue_270(payload jsonb)
returns bigint
language sql
security definer
set search_path = ''
as $$
  select pgmq.send('coverage_270', payload)
$$;

create function public.queue_status_270()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select pg_catalog.jsonb_build_object(
    'queued', (select count(*) from pgmq.q_coverage_270),
    'archived', (select count(*) from pgmq.a_coverage_270)
  )
$$;

revoke execute on function public.queue_enqueue_270(jsonb), public.queue_status_270()
from public, anon, authenticated;
grant execute on function public.queue_enqueue_270(jsonb), public.queue_status_270()
to service_role;
notify pgrst, 'reload schema';
select pg_sleep(1);

select jsonb_build_object(
  'valid',
    to_regclass('pgmq.q_coverage_270') is not null
    and to_regclass('pgmq.a_coverage_270') is not null
    and not has_function_privilege('anon', 'public.queue_enqueue_270(jsonb)', 'EXECUTE')
)::text;
