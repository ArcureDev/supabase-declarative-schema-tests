insert into public.type_widening_guard values (2, 2147483648);

select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select format_type(atttypid, atttypmod) = 'bigint' and attnotnull
     from pg_attribute
     where attrelid = 'public.type_widening_guard'::regclass
       and attname = 'amount' and not attisdropped)
    and (select array_agg(amount order by id) =
                array[2147483647,2147483648]::bigint[]
         from public.type_widening_guard)
)::text;
