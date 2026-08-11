select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select attidentity = 'd'
     from pg_attribute
     where attrelid = 'public.identity_guard'::regclass
       and attname = 'id' and not attisdropped)
    and (select id = 1 and title = 'existing'
         from public.identity_guard)
)::text;
