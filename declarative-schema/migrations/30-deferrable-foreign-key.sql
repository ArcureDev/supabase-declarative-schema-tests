create table public.organizations (
  id bigint generated always as identity primary key,
  name text not null
);

create table public.organization_members (
  id bigint generated always as identity primary key,
  organization_id bigint not null,
  display_name text not null,
  constraint organization_members_organization_id_fkey
    foreign key (organization_id)
    references public.organizations (id)
    deferrable initially deferred
);
