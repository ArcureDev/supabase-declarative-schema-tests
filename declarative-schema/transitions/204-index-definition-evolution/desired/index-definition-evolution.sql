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

create unique index index_evolution_lookup_idx
  on public.index_evolution (
    category text_pattern_ops asc nulls last,
    (lower(code)) collate "C" text_pattern_ops desc nulls first
  )
  include (score, payload)
  with (fillfactor = 70)
  where active and score > 0;

create index index_evolution_hash_idx
  on public.index_evolution using hash (code);
