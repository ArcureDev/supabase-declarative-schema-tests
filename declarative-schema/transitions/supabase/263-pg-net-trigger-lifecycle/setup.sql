-- Invariant: lifecycle DDL never invokes the local-invalid webhook.
insert into public.transition_anchor values (263, 'pg-net-trigger-lifecycle');
alter table public.webhook_events_263 disable trigger webhook_lifecycle_263;
insert into public.webhook_events_263 values (1, 'preserved', true);
alter table public.webhook_events_263 enable trigger webhook_lifecycle_263;
insert into public.webhook_identity_263
select
  1,
  'public.webhook_events_263'::regclass::oid,
  'public.dispatch_webhook_263()'::regprocedure::oid,
  (select oid from pg_trigger
   where tgrelid = 'public.webhook_events_263'::regclass
     and tgname = 'webhook_lifecycle_263');
