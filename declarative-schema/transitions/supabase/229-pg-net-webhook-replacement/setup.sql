insert into public.transition_anchor (case_no, payload)
select
  229,
  jsonb_build_object(
    'table_oid', 'public.webhook_events_229'::regclass::oid,
    'function_oid', routine.oid,
    'function_acl', coalesce(to_jsonb(routine.proacl), 'null'::jsonb),
    'trigger_oid', webhook_trigger.oid
  )::text
from pg_proc as routine
cross join pg_trigger as webhook_trigger
where routine.oid = 'public.notify_transition_229()'::regprocedure
  and webhook_trigger.tgrelid = 'public.webhook_events_229'::regclass
  and webhook_trigger.tgname = 'transition_webhook_229'
  and not webhook_trigger.tgisinternal;
