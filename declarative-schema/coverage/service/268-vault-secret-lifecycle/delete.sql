-- Invariant: deletion removes both encrypted and decrypted projections.
delete from vault.secrets where name = 'coverage_268_token';
select jsonb_build_object(
  'valid',
    not exists (select 1 from vault.secrets where name = 'coverage_268_token')
    and not exists (select 1 from vault.decrypted_secrets where name = 'coverage_268_token')
)::text;
