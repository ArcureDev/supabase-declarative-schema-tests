create table public.delivery_windows (
  id bigint generated always as identity primary key,
  opens_at timestamptz not null default (now() + interval '1 day')
);
