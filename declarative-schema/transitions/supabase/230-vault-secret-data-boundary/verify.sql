select jsonb_build_object(
          'identity',
          'public.transition_anchor'::regclass::oid,
          'valid',
          (
            select count(*) = 1
              and bool_and(case_no = 230 and payload = 'case-230')
            from public.transition_anchor
          )
          and (
        (select count(*) = 1 from vault.secrets where name = 'transition_230_token')
and (
  select secret::text <> 'PGDELTA_VAULT_SECRET_230'
  from vault.secrets where name = 'transition_230_token'
)
and public.transition_vault_header_230() = 'Bearer PGDELTA_VAULT_SECRET_230'
and not has_function_privilege('anon', 'public.transition_vault_header_230()', 'EXECUTE')
and not has_function_privilege('authenticated', 'public.transition_vault_header_230()', 'EXECUTE')
          )
        )::text;
