-- Invariant: Vault ciphertext and webhook identities survive helper evolution.
insert into public.transition_anchor values (264, 'vault-backed-webhook');
select vault.create_secret(
  'VAULT_WEBHOOK_SECRET_264',
  'webhook_264_token',
  'runtime-only webhook credential'
);
alter table public.vault_webhook_events_264 disable trigger vault_webhook_264;
insert into public.vault_webhook_events_264 values (1, 'preserved');
alter table public.vault_webhook_events_264 enable trigger vault_webhook_264;
insert into public.vault_webhook_identity_264
select
  1,
  'public.vault_webhook_events_264'::regclass::oid,
  'public.dispatch_vault_webhook_264()'::regprocedure::oid,
  (select oid from pg_trigger
   where tgrelid = 'public.vault_webhook_events_264'::regclass
     and tgname = 'vault_webhook_264');
