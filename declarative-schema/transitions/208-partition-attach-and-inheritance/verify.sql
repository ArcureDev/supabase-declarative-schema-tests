insert into public.partition_attach_orders (ordered_on, customer_id, payload)
values ('2026-05-01', 8, 'after');

select json_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and min(id) = 1 and min(payload) = 'preserved'
     from public.transition_anchor)
    and (
      select count(*) = 2
        and array_agg(id order by id) = array[1, 2]::bigint[]
        and array_agg(payload order by id) = array['keep', 'AFTER']
         from public.partition_attach_orders)
    and (
      select bool_and(tableoid = 'public.partition_attach_existing'::regclass)
      from public.partition_attach_orders
    )
    and exists (
      select 1 from pg_inherits
      where inhrelid = 'public.partition_attach_existing'::regclass
        and inhparent = 'public.partition_attach_orders'::regclass
    )
    and exists (
      select 1 from pg_inherits
      where inhrelid =
        'public.partition_attach_existing_customer_idx'::regclass
        and inhparent =
        'public.partition_attach_orders_customer_idx'::regclass
    )
    and exists (
      select 1 from pg_trigger
      where tgrelid = 'public.partition_attach_existing'::regclass
        and tgname = 'partition_attach_uppercase' and not tgisinternal
    )
    and exists (
      select 1 from pg_class
      where oid = 'public.partition_attach_orders'::regclass
        and relrowsecurity
    )
    and exists (
      select 1 from pg_policy
      where polrelid = 'public.partition_attach_orders'::regclass
        and polname = 'partition_attach_open'
    )
    and exists (
      select 1
      from pg_publication p
      join pg_publication_rel pr on pr.prpubid = p.oid
      where p.pubname = 'partition_attach_publication'
        and p.pubviaroot
        and pr.prrelid = 'public.partition_attach_orders'::regclass
    )
    and exists (
      select 1 from pg_constraint
      where conrelid = 'public.partition_attach_refs'::regclass
        and conname = 'partition_attach_refs_order_fk' and convalidated
    )
    and (select count(*) = 2 from pg_inherits
         where inhrelid = 'public.inherit_multi_child'::regclass)
    and (select count(*) = 1 from pg_inherits
         where inhrelid = 'public.inherit_drop_child'::regclass
           and inhparent = 'public.inherit_base_a'::regclass)
    and (select attinhcount = 1 from pg_attribute
         where attrelid = 'public.inherit_multi_child'::regclass
           and attname = 'tag' and not attisdropped)
    and (select attinhcount = 0 from pg_attribute
         where attrelid = 'public.inherit_drop_child'::regclass
           and attname = 'tag' and not attisdropped)
    and exists (
      select 1 from pg_constraint
      where conrelid = 'public.inherit_base_a'::regclass
        and conname = 'inherit_base_payload_check' and connoinherit
    )
    and (select count(*) = 1 from only public.inherit_multi_child)
    and (select count(*) = 1 from only public.inherit_drop_child)
)::text;
