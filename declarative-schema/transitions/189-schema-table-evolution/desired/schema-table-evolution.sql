create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create schema transition_app;

create table transition_app.widgets (
  id bigint generated always as identity primary key,
  label text not null,
  active boolean not null default true
);
