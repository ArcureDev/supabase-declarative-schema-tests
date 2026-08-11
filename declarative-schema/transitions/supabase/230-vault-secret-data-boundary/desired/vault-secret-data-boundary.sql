create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists supabase_vault with schema vault;
create function public.transition_vault_header_230()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select 'Bearer ' || decrypted_secret
  from vault.decrypted_secrets
  where name = 'transition_230_token'
$$;
revoke execute on function public.transition_vault_header_230()
  from public, anon, authenticated;
