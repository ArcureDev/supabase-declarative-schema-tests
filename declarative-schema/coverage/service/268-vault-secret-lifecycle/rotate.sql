-- Invariant: rotation preserves secret identity and changes only encrypted payload/metadata.
select vault.update_secret(
  id,
  'VAULT_COVERAGE_SECRET_268_BETA',
  'coverage_268_token',
  'rotated-v2'
)
from vault.secrets
where name = 'coverage_268_token';

select jsonb_build_object(
  'valid',
    (select count(*) = 1 from vault.secrets
     where name = 'coverage_268_token' and description = 'rotated-v2')
    and (select secret::text <> 'VAULT_COVERAGE_SECRET_268_BETA'
         from vault.secrets where name = 'coverage_268_token')
)::text;
