-- Invariant: the credential exists only as encrypted Vault runtime data.
insert into public.transition_anchor (case_no, payload)
values (278, 'case-278');

select vault.create_secret(
  'PGDELTA_WRAPPER_VAULT_SECRET_278',
  'transition_wrapper_credential_278',
  'runtime-only Wrappers credential'
);

do $setup$
declare
  credential_id uuid;
begin
  select id into strict credential_id
  from vault.secrets
  where name = 'transition_wrapper_credential_278';

  execute format(
    'alter server transition_vault_server_278 options (add api_key_id %L)',
    credential_id::text
  );
end
$setup$;
