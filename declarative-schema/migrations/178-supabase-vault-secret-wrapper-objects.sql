create extension if not exists supabase_vault
with schema vault;

create table public.vault_wrapped_items (
  id bigint generated always as identity primary key,
  secret_id uuid
);
