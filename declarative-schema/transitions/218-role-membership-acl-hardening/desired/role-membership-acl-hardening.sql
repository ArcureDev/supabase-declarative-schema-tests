create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create role transition_parent_218
  nologin nosuperuser nocreatedb nocreaterole inherit noreplication nobypassrls;
create role transition_member_218
  nologin nosuperuser nocreatedb nocreaterole inherit noreplication nobypassrls
  connection limit 3;

grant transition_parent_218 to transition_member_218 with admin option;

create table public.role_acl_218 (
  id bigint generated always as identity primary key,
  tenant_name text not null,
  body text not null
);

alter table public.role_acl_218 enable row level security;

create policy transition_role_select_218
on public.role_acl_218
for select
to transition_parent_218
using (tenant_name = current_user);

grant select, update on table public.role_acl_218 to transition_parent_218;
