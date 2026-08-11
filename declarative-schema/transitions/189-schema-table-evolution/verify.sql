insert into transition_app.widgets (label) values ('created');

select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and min(payload) = 'preserved'
     from public.transition_anchor)
    and exists (
      select 1
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'transition_app'
        and c.relname = 'widgets'
        and c.relkind = 'r'
    )
    and (
      select attidentity = 'a'
      from pg_attribute
      where attrelid = 'transition_app.widgets'::regclass
        and attname = 'id'
        and not attisdropped
    )
    and (select count(*) = 1 and min(id) = 1 and bool_and(active)
         from transition_app.widgets)
)::text;
