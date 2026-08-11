-- Invariant: the initial relation is populated and readable only as declared.
drop table if exists public.cache_items_277 cascade;
drop table if exists public.cache_private_277;
create table public.cache_items_277 (
  id bigint generated always as identity primary key,
  label text not null
);
create table public.cache_private_277 (
  case_no integer primary key,
  private_value text not null
);
insert into public.cache_items_277 (label) values ('cache-row-277');
insert into public.cache_private_277 (case_no, private_value)
values (277, 'PGDELTA_CACHE_SECRET_277');
revoke all on table public.cache_items_277 from public;
revoke all on table public.cache_private_277 from public, anon, authenticated;
grant select on table public.cache_items_277 to anon, authenticated;
notify pgrst, 'reload schema';
select pg_sleep(1);
select jsonb_build_object(
  'identity', 'public.cache_items_277'::regclass::oid,
  'valid',
    (select count(*) = 1 and bool_and(label = 'cache-row-277')
     from public.cache_items_277)
    and (select count(*) = 1 and bool_and(case_no = 277)
         from public.cache_private_277)
    and has_table_privilege('anon', 'public.cache_items_277', 'SELECT')
    and not has_table_privilege('anon', 'public.cache_items_277', 'INSERT')
)::text;
