create schema if not exists tenant;
create schema if not exists api;

create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table tenant.organizations (
  id uuid primary key,
  name text not null unique
);

create table tenant.memberships (
  organization_id uuid not null references tenant.organizations (id),
  user_id uuid not null,
  member_role text not null check (member_role in ('owner', 'member')),
  primary key (organization_id, user_id)
);

alter table tenant.organizations enable row level security;
alter table tenant.memberships enable row level security;

create policy organizations_member_read
on tenant.organizations
for select
to authenticated
using (
  exists (
    select 1
    from tenant.memberships as membership
    where membership.organization_id = organizations.id
      and membership.user_id =
        nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
  )
);

create policy memberships_self_read
on tenant.memberships
for select
to authenticated
using (
  user_id = nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
);

create function tenant.custom_access_token_hook(event jsonb)
returns jsonb
language sql
stable
security definer
set search_path = pg_catalog, tenant
as $$
  select jsonb_set(
    event,
    '{claims}',
    coalesce(event -> 'claims', '{}'::jsonb)
      || '{"tenant_release":"v1"}'::jsonb,
    true
  )
$$;

create view api.organization_summary
with (security_invoker = true)
as
select id, name
from tenant.organizations;

comment on view api.organization_summary is
  '@graphql({"name":"Organization"})';

grant usage on schema tenant, api to authenticated;
grant select
on tenant.organizations, tenant.memberships, api.organization_summary
to authenticated;
grant usage on schema tenant to supabase_auth_admin;
grant execute
on function tenant.custom_access_token_hook(jsonb)
to supabase_auth_admin;
revoke execute
on function tenant.custom_access_token_hook(jsonb)
from public, anon, authenticated;
