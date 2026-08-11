select json_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and min(id) = 1 and min(payload) = 'preserved'
     from public.transition_anchor)
    and (select count(*) = 0 from only public.partition_attach_orders)
    and (select count(*) = 1 and min(payload) = 'keep'
         from public.partition_attach_existing)
    and not exists (
      select 1 from pg_inherits
      where inhrelid = 'public.partition_attach_existing'::regclass
    )
    and exists (
      select 1 from pg_constraint
      where conrelid = 'public.partition_attach_existing'::regclass
        and conname = 'partition_attach_existing_bound' and convalidated
    )
    and (select count(*) = 1 from pg_inherits
         where inhrelid = 'public.inherit_multi_child'::regclass)
    and (select count(*) = 2 from pg_inherits
         where inhrelid = 'public.inherit_drop_child'::regclass)
    and exists (
      select 1 from pg_constraint
      where conrelid = 'public.inherit_base_a'::regclass
        and conname = 'inherit_base_payload_check' and not connoinherit
    )
)::text;
