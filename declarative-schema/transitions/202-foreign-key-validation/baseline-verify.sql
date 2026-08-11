select json_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and min(id) = 1 and min(payload) = 'preserved'
     from public.transition_anchor)
    and (select count(*) = 2 from public.constraint_parent)
    and (select count(*) = 1 and min(legacy_code) = 'missing'
         from accounting.constraint_child)
    and exists (
      select 1 from pg_constraint
      where conrelid = 'accounting.constraint_child'::regclass
        and conname = 'constraint_child_parent_fk'
        and not convalidated
    )
)::text;
