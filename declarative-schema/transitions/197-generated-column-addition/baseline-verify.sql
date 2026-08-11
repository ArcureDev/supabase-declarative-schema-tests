select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    not exists (
      select 1 from pg_attribute
      where attrelid = 'public.generated_guard'::regclass
        and attname = 'total' and not attisdropped
    )
    and (select quantity = 2 and unit_price = 12.50
         from public.generated_guard where id = 1)
)::text;
