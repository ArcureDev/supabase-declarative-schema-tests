insert into public.transition_anchor (id, payload)
values (237, 'tenant-modular-graphql');

insert into tenant.organizations (id, name)
values ('23700000-0000-0000-0000-000000000001', 'Acme');

insert into tenant.memberships (organization_id, user_id, member_role)
values (
  '23700000-0000-0000-0000-000000000001',
  '23700000-0000-0000-0000-000000000002',
  'owner'
);
