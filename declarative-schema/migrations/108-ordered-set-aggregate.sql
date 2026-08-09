create function public.fixture_percentile_state(
  state double precision[],
  value double precision
)
returns double precision[]
language sql
immutable
as $$
  select case
    when state is null then array[value]
    else state || value
  end;
$$;

create function public.fixture_percentile_final(
  state double precision[],
  fraction double precision
)
returns double precision
language sql
immutable
as $$
  select percentile_cont(fraction) within group (order by value)
  from unnest(state) as value;
$$;

create aggregate public.fixture_percentile(double precision order by double precision) (
  sfunc = public.fixture_percentile_state,
  stype = double precision[],
  finalfunc = public.fixture_percentile_final
);
