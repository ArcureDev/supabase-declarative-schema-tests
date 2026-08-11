select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select format_type(atttypid, atttypmod) = 'integer'
     from pg_attribute
     where attrelid = 'public.type_widening_guard'::regclass
       and attname = 'amount' and not attisdropped)
    and (select amount = 2147483647
         from public.type_widening_guard where id = 1)
)::text;
