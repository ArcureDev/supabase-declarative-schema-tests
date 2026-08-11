insert into public.not_null_guard values (99, null);
delete from public.not_null_guard where id = 99;

select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    not (select attnotnull
         from pg_attribute
         where attrelid = 'public.not_null_guard'::regclass
           and attname = 'note' and not attisdropped)
    and (select note = 'ready'
         from public.not_null_guard where id = 1)
)::text;
