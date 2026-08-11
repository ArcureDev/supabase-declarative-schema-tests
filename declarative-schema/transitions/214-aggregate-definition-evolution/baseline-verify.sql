select jsonb_build_object(
  'identity',
  'public.transition_anchor'::regclass::oid,
  'valid',
  (
    (select public.transition_sum(value) = 5 from public.transition_numbers)
    and (
      select
        aggregate_definition.agginitval = '0'
        and aggregate_definition.aggtransfn =
          'public.transition_sum_state(integer,integer)'::regprocedure
      from pg_aggregate as aggregate_definition
      where aggregate_definition.aggfnoid =
        'public.transition_sum(integer)'::regprocedure
    )
  )
)::text;
