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
  billing_role text not null default 'collaborator'
    check (billing_role in ('admin', 'collaborator', 'viewer')),
  primary key (organization_id, user_id)
);

create table tenant.invitations (
  id bigint generated always as identity primary key,
  organization_id uuid not null references tenant.organizations (id),
  email text not null,
  invited_role text not null default 'member',
  expires_at timestamptz not null,
  accepted_at timestamptz,
  unique (organization_id, email)
);

create index invitations_pending_idx
on tenant.invitations (organization_id, expires_at)
where accepted_at is null;

alter table tenant.organizations enable row level security;
alter table tenant.memberships enable row level security;
alter table tenant.invitations enable row level security;

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

create policy invitations_owner_manage
on tenant.invitations
for all
to authenticated
using (
  exists (
    select 1
    from tenant.memberships as membership
    where membership.organization_id = invitations.organization_id
      and membership.member_role = 'owner'
      and membership.user_id =
        nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
  )
)
with check (
  exists (
    select 1
    from tenant.memberships as membership
    where membership.organization_id = invitations.organization_id
      and membership.member_role = 'owner'
      and membership.user_id =
        nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
  )
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
      || jsonb_build_object(
        'tenant_release',
        'v2',
        'organization_roles',
        coalesce(
          (
            select jsonb_object_agg(
              membership.organization_id::text,
              membership.member_role
            )
            from tenant.memberships as membership
            where membership.user_id = (event ->> 'user_id')::uuid
          ),
          '{}'::jsonb
        )
      ),
    true
  )
$$;

create view api.organization_summary
with (security_invoker = true)
as
select
  organization.id,
  organization.name,
  count(membership.user_id)::bigint as member_count
from tenant.organizations as organization
left join tenant.memberships as membership
  on membership.organization_id = organization.id
group by organization.id, organization.name;

comment on view api.organization_summary is
  '@graphql({"name":"Organization","description":"Tenant API v2"})';

grant usage on schema tenant, api to authenticated;
grant select
on tenant.organizations,
  tenant.memberships,
  tenant.invitations,
  api.organization_summary
to authenticated;
grant insert, update, delete on tenant.invitations to authenticated;
grant usage, select on sequence tenant.invitations_id_seq to authenticated;
grant usage on schema tenant to supabase_auth_admin;
grant execute
on function tenant.custom_access_token_hook(jsonb)
to supabase_auth_admin;
revoke execute
on function tenant.custom_access_token_hook(jsonb)
from public, anon, authenticated;
