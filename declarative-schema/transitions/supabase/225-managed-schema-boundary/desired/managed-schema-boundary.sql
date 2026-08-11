create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create table public.managed_probe_225 (
  id integer primary key,
  snapshot jsonb not null
);
create table public.boundary_app_225 (
  id bigint generated always as identity primary key,
  label text not null,
  note text not null default ''
);
