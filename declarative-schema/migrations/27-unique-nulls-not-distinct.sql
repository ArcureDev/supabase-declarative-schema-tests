create table public.external_accounts (
  id bigint generated always as identity primary key,
  external_id text,
  constraint external_accounts_external_id_key
    unique nulls not distinct (external_id)
);
