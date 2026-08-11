create table public.transition_anchor (
  id bigint generated always as identity primary key,
  label text not null
);

create table public.transition_view_source (
  id bigint generated always as identity primary key,
  amount integer not null
);

create view public.transition_live as
select id, amount
from public.transition_view_source;

create materialized view public.transition_rollup as
select
  count(*)::bigint as row_count,
  sum(amount)::bigint as total
from public.transition_view_source
with no data;
