insert into public.batch_column_guard (id, payload) values (2, 'new');

select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 2 and bool_and(attnotnull)
     from pg_attribute
     where attrelid = 'public.batch_column_guard'::regclass
       and attname in ('tags', 'metadata')
       and not attisdropped)
    and (select count(*) = 2
         and bool_and(tags = '{}'::text[] and metadata = '{}'::jsonb)
         from public.batch_column_guard)
    and (select payload = 'existing'
         from public.batch_column_guard where id = 1)
)::text;
