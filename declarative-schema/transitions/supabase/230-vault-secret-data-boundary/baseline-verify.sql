select jsonb_build_object(
  'identity',
  'public.transition_vault_header_230()'::regprocedure::oid,
  'valid',
  (
    select count(*) = 1
      and bool_and(
        case_no = 230
        and (payload::jsonb ->> 'function_oid')::oid =
          'public.transition_vault_header_230()'::regprocedure::oid
        and (payload::jsonb ->> 'extension_oid')::oid = (
          select oid from pg_extension where extname = 'supabase_vault'
        )
        and payload::jsonb -> 'function_acl' = (
          select coalesce(to_jsonb(proacl), 'null'::jsonb)
          from pg_proc
          where oid = 'public.transition_vault_header_230()'::regprocedure
        )
      )
    from public.transition_anchor
  )
  and (
    select prosecdef
      and provolatile = 's'
      and prorettype = 'text'::regtype
      and language.lanname = 'sql'
      and array_to_string(proconfig, ',') ilike '%search_path=%'
    from pg_proc as routine
    join pg_language as language on language.oid = routine.prolang
    where routine.oid = 'public.transition_vault_header_230()'::regprocedure
  )
  -- Compare inside SQL so the decrypted value never appears in query output.
  and exists (
    select 1
    from vault.decrypted_secrets as secret
    where secret.id = (
      select (payload::jsonb ->> 'secret_id')::uuid
      from public.transition_anchor
      where case_no = 230
    )
      and secret.name = 'transition_230_token'
      and secret.decrypted_secret = 'PGDELTA_VAULT_SECRET_230'
  )
  and exists (
    select 1
    from vault.secrets as encrypted_secret
    where encrypted_secret.id = (
      select (payload::jsonb ->> 'secret_id')::uuid
      from public.transition_anchor
      where case_no = 230
    )
      and encrypted_secret.name = 'transition_230_token'
      and encrypted_secret.secret::text <> 'PGDELTA_VAULT_SECRET_230'
  )
  and public.transition_vault_header_230() = 'PGDELTA_VAULT_SECRET_230'
  and position(
    'PGDELTA_VAULT_SECRET_230' in pg_get_functiondef(
      'public.transition_vault_header_230()'::regprocedure
    )
  ) = 0
  and not has_function_privilege(
    'anon',
    'public.transition_vault_header_230()',
    'EXECUTE'
  )
  and not has_function_privilege(
    'authenticated',
    'public.transition_vault_header_230()',
    'EXECUTE'
  )
)::text;
