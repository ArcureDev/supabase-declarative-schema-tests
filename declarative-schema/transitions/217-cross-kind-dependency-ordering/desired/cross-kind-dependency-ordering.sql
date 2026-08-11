create table public.transition_anchor (
  id bigint generated always as identity primary key,
  label text not null
);

create table public.transition_dependency_source (
  id bigint generated always as identity primary key,
  value integer not null
);

create table public.transition_dependency_log (
  source_id bigint not null
);

create function public.transition_sum_state(state integer, value integer)
returns integer
language sql
immutable
strict
as $$
  select state + value
$$;

create aggregate public.transition_total(integer) (
  sfunc = public.transition_sum_state,
  stype = integer,
  initcond = '0'
);

create function public.transition_scale(input_value integer)
returns integer
language sql
immutable
strict
as $$
  select input_value * 2
$$;

create view public.transition_summary as
select public.transition_scale(public.transition_total(value)) as result
from public.transition_dependency_source;

create materialized view public.transition_snapshot as
select result
from public.transition_summary
with no data;

create function public.transition_dependency_capture()
returns trigger
language plpgsql
as $$
begin
  insert into public.transition_dependency_log (source_id) values (new.id);
  return new;
end
$$;

create trigger transition_dependency_capture
after insert on public.transition_dependency_source
for each row
execute function public.transition_dependency_capture();
