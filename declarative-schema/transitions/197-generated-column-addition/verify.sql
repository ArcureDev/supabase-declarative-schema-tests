insert into public.generated_guard (id, quantity, unit_price)
values (2, 4, 2.50);

select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    exists (
      select 1
      from pg_attribute a
      join pg_attrdef d
        on d.adrelid = a.attrelid and d.adnum = a.attnum
      where a.attrelid = 'public.generated_guard'::regclass
        and a.attname = 'total'
        and a.attgenerated = 's'
        and pg_get_expr(d.adbin, d.adrelid) like '%quantity%unit_price%'
        and not a.attisdropped
    )
    and (select array_agg(total order by id) =
                array[25.00,10.00]::numeric[]
         from public.generated_guard)
)::text;
