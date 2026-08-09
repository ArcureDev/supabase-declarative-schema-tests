create table public.project_memberships (
  project_id bigint not null,
  member_id bigint not null,
  joined_at timestamptz not null default now(),
  constraint project_memberships_pkey primary key (project_id, member_id)
);
