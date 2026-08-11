create table public.transition_anchor (
  id bigint generated always as identity primary key,
  label text not null
);

create table public.transition_dependency_source (
  id bigint generated always as identity primary key,
  value integer not null
);

create table public.transition_dependency_log (
  source_id bigint not null
);
