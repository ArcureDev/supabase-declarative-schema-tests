do $$
begin
  begin
    insert into public.not_null_guard values (99, null);
    raise exception 'NULL was unexpectedly accepted';
  exception when not_null_violation then
    null;
  end;
end
$$;

insert into public.not_null_guard values (2, 'accepted');

select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select attnotnull
     from pg_attribute
     where attrelid = 'public.not_null_guard'::regclass
       and attname = 'note' and not attisdropped)
    and not exists (select 1 from public.not_null_guard where id = 99)
    and (select array_agg(note order by id) = array['ready','accepted']
         from public.not_null_guard)
)::text;
