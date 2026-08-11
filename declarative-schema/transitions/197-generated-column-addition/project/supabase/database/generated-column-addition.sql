create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);

create table public.generated_guard (
  id bigint primary key,
  quantity integer not null,
  unit_price numeric(10,2) not null
);
