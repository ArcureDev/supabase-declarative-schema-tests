create table public.transition_anchor (
  id integer primary key,
  payload text not null
);

create table public.index_evolution (
  id bigint primary key,
  code text not null,
  category text not null,
  score integer not null,
  payload text not null,
  active boolean not null
);

create index index_evolution_code_old_idx
  on public.index_evolution (code);

create index index_evolution_lookup_idx
  on public.index_evolution (category, score asc nulls last)
  include (payload)
  with (fillfactor = 80)
  where active;

create index index_evolution_retired_idx
  on public.index_evolution (score);
