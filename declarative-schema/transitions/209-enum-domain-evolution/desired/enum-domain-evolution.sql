create table public.transition_anchor (
  id bigint generated always as identity primary key,
  label text not null
);

create type public.transition_status as enum ('new', 'reviewing', 'done');

create domain public.transition_code as text
  default 'queued'
  check (value <> '');

create table public.transition_type_rows (
  id bigint generated always as identity primary key,
  status public.transition_status not null,
  code public.transition_code not null
);
