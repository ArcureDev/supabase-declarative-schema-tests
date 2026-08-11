create schema accounting;

create table public.transition_anchor (
  id integer primary key,
  payload text not null
);

create table public.constraint_parent (
  tenant_id bigint not null,
  id bigint not null,
  parent_id bigint,
  constraint constraint_parent_pkey primary key (tenant_id, id)
);

create table public.constraint_codes (code text primary key);

create table accounting.constraint_child (
  id bigint primary key,
  tenant_id bigint not null,
  parent_id bigint not null,
  reviewer_tenant_id bigint,
  reviewer_id bigint,
  legacy_code text
);

alter table accounting.constraint_child
  add constraint constraint_child_parent_fk
  foreign key (tenant_id, parent_id)
  references public.constraint_parent (tenant_id, id)
  match simple on update no action on delete restrict
  deferrable initially immediate;

alter table accounting.constraint_child
  add constraint constraint_child_reviewer_fk
  foreign key (reviewer_tenant_id, reviewer_id)
  references public.constraint_parent (tenant_id, id)
  match full on update cascade on delete set null
  deferrable initially deferred;

alter table accounting.constraint_child
  add constraint constraint_child_legacy_fk
  foreign key (legacy_code) references public.constraint_codes (code)
  not valid;

alter table public.constraint_parent
  add constraint constraint_parent_self_fk
  foreign key (tenant_id, parent_id)
  references public.constraint_parent (tenant_id, id)
  deferrable initially deferred;
