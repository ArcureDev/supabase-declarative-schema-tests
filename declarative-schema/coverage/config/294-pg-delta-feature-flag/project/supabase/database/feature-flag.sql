-- Identity, generated columns, and INCLUDE indexes provide nontrivial engine evidence.
create table public.coverage_pgdelta_flag (
  id bigint generated always as identity primary key,
  source text not null,
  normalized text generated always as (lower(source)) stored
);
create unique index coverage_pgdelta_flag_normalized_idx
  on public.coverage_pgdelta_flag (normalized)
  include (source);
