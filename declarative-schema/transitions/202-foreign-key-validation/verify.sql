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
        and conname = 'constraint_child_parent_fk' and convalidated
    )
    and exists (
      select 1 from pg_constraint
      where conrelid = 'accounting.constraint_child'::regclass
        and conname = 'constraint_child_legacy_fk'
        and confrelid = 'public.constraint_codes'::regclass
        and conkey = array[(
          select attnum from pg_attribute
          where attrelid = 'accounting.constraint_child'::regclass
            and attname = 'legacy_code'
        )]::smallint[]
        and confkey = array[(
          select attnum from pg_attribute
          where attrelid = 'public.constraint_codes'::regclass
            and attname = 'code'
        )]::smallint[]
        and not convalidated
    )
    and exists (
      select 1 from pg_constraint
      where conrelid = 'accounting.constraint_child'::regclass
        and conname = 'constraint_child_reviewer_fk'
        and condeferrable and condeferred
        and pg_get_constraintdef(oid) ilike '%match full%'
        and pg_get_constraintdef(oid) ilike '%on update cascade%'
        and pg_get_constraintdef(oid) ilike '%on delete set null%'
    )
    and exists (
      select 1 from pg_constraint
      where conrelid = 'public.constraint_parent'::regclass
        and conname = 'constraint_parent_self_fk'
        and confrelid = 'public.constraint_parent'::regclass
        and conkey = array[
          (select attnum from pg_attribute
           where attrelid = 'public.constraint_parent'::regclass
             and attname = 'tenant_id'),
          (select attnum from pg_attribute
           where attrelid = 'public.constraint_parent'::regclass
             and attname = 'parent_id')
        ]::smallint[]
        and confkey = array[
          (select attnum from pg_attribute
           where attrelid = 'public.constraint_parent'::regclass
             and attname = 'tenant_id'),
          (select attnum from pg_attribute
           where attrelid = 'public.constraint_parent'::regclass
             and attname = 'id')
        ]::smallint[]
        and condeferrable and condeferred
    )
)::text;
