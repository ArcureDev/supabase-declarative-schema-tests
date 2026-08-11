insert into public.transition_anchor (case_no, payload)
values (230, 'case-230');

select vault.create_secret(
  'PGDELTA_VAULT_SECRET_230',
  'transition_230_token',
  'runtime-only transition secret'
);
