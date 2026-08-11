select jsonb_build_object(
  'identity',
  'public.transition_anchor'::regclass::oid,
  'valid',
  (
    (select sum(value) = 5 from public.transition_dependency_source)
    and not exists (select 1 from public.transition_dependency_log)
  )
)::text;
