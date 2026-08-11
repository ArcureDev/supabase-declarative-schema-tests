insert into public.transition_dependency_source (value) values (4);
refresh materialized view public.transition_snapshot;

select jsonb_build_object(
  'identity',
  'public.transition_anchor'::regclass::oid,
  'valid',
  (
    (select result = 18 from public.transition_summary)
    and (select result = 18 from public.transition_snapshot)
    and (
      select jsonb_agg(source_id) = '[3]'::jsonb
      from public.transition_dependency_log
    )
    and (
      select aggtransfn =
        'public.transition_sum_state(integer,integer)'::regprocedure
      from pg_aggregate
      where aggfnoid = 'public.transition_total(integer)'::regprocedure
    )
    and exists (
      select 1
      from pg_rewrite as rewrite_rule
      join pg_depend as dependency
        on dependency.classid = 'pg_rewrite'::regclass
       and dependency.objid = rewrite_rule.oid
      where rewrite_rule.ev_class = 'public.transition_summary'::regclass
        and dependency.refclassid = 'pg_proc'::regclass
        and dependency.refobjid =
          'public.transition_total(integer)'::regprocedure
    )
    and exists (
      select 1
      from pg_rewrite as rewrite_rule
      join pg_depend as dependency
        on dependency.classid = 'pg_rewrite'::regclass
       and dependency.objid = rewrite_rule.oid
      where rewrite_rule.ev_class = 'public.transition_snapshot'::regclass
        and dependency.refclassid = 'pg_class'::regclass
        and dependency.refobjid = 'public.transition_summary'::regclass
    )
    and (
      select tgfoid =
        'public.transition_dependency_capture()'::regprocedure
      from pg_trigger
      where tgrelid = 'public.transition_dependency_source'::regclass
        and tgname = 'transition_dependency_capture'
    )
  )
)::text;
