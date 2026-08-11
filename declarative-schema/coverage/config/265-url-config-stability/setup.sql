-- Invariant: configuration probes are local and expose only the intended row.
create table public.config_probe_265 (
  id integer primary key,
  value text not null
);
insert into public.config_probe_265 values (265, 'configured-url');
grant select on public.config_probe_265 to anon;
notify pgrst, 'reload schema';
select pg_sleep(1);

select jsonb_build_object(
  'valid',
    has_table_privilege('anon', 'public.config_probe_265', 'SELECT')
    and not has_table_privilege('anon', 'public.config_probe_265', 'INSERT')
)::text;
