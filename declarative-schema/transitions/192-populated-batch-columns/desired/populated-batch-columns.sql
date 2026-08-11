create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.batch_column_guard (
  id bigint primary key,
  payload text not null,
  tags text[] not null default '{}'::text[],
  metadata jsonb not null default '{}'::jsonb
);
