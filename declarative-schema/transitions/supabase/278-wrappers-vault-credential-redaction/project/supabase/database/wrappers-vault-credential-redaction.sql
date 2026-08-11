-- Invariant: declarations contain references and endpoints, never secret plaintext.
create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists supabase_vault with schema vault;
create extension if not exists wrappers with schema extensions;
create foreign data wrapper transition_vault_wrapper_278
  handler extensions.wasm_fdw_handler
  validator extensions.wasm_fdw_validator;
create server transition_vault_server_278
  foreign data wrapper transition_vault_wrapper_278
  options (
    fdw_package_url 'https://packages.invalid/openapi_fdw.wasm',
    fdw_package_name 'supabase:openapi-fdw',
    fdw_package_version '0.2.0',
    fdw_package_checksum 'f0d4d6e50f7c519a66363bd8bdbe1ea8086ca810ca14b43fb0ed18b64acdf6aa',
    base_url 'https://vault-wrapper.invalid/v1'
  );
grant usage on foreign server transition_vault_server_278 to authenticated;
