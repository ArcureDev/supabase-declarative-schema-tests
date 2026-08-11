do $$
begin
  begin
    insert into public.identity_guard (id, title) values (99, 'forbidden');
    raise exception 'explicit identity was unexpectedly accepted';
  exception when sqlstate '428C9' then
    null;
  end;
end
$$;

insert into public.identity_guard (title) values ('generated');
insert into public.identity_guard (id, title)
  overriding system value values (50, 'overridden');

select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select attidentity = 'a'
     from pg_attribute
     where attrelid = 'public.identity_guard'::regclass
       and attname = 'id' and not attisdropped)
    and (select array_agg(id order by id) = array[1,2,50]::bigint[]
         from public.identity_guard)
    and not exists (select 1 from public.identity_guard where id = 99)
)::text;
