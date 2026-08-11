create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.data_shape_guard (
  id bigint primary key,
  nullable_text text,
  tags text[] not null,
  document jsonb not null,
  bytes bytea not null,
  large_text text not null,
  amount numeric(20,4) not null,
  happened_at timestamptz not null
);
