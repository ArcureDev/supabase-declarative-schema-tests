select jsonb_build_object(
  'table_oid',
  'public.no_op_convergence_guard'::regclass::oid,
  'comment',
  obj_description('public.no_op_convergence_guard'::regclass, 'pg_class'),
  'rows',
  (
    select jsonb_agg(to_jsonb(source_row) order by source_row.id)
    from public.no_op_convergence_guard as source_row
  )
)::text;
