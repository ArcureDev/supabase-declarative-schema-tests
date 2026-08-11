-- Invariant: state A links the server to encrypted Vault data without ACL leakage.
select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and bool_and(case_no = 278 and payload = 'case-278')
       from public.transition_anchor)
    and exists (
      select 1
      from pg_foreign_server server,
           lateral pg_options_to_table(server.srvoptions) option
      where server.srvname = 'transition_vault_server_278'
        and option.option_name = 'base_url'
        and option.option_value = 'https://vault-wrapper.invalid/v1'
    )
    and exists (
      select 1
      from pg_foreign_server server,
           lateral pg_options_to_table(server.srvoptions) option
      join vault.secrets secret
        on secret.id::text = option.option_value
      where server.srvname = 'transition_vault_server_278'
        and option.option_name = 'api_key_id'
        and secret.name = 'transition_wrapper_credential_278'
        and secret.secret::text <> 'PGDELTA_WRAPPER_VAULT_SECRET_278'
    )
    and has_server_privilege(
          'authenticated', 'transition_vault_server_278', 'USAGE')
    and not has_server_privilege(
          'anon', 'transition_vault_server_278', 'USAGE')
)::text;
