-- Invariant: this fixture raises locally and contains no remote client call.
drop function if exists public.probe_remote_279();
drop table if exists public.remote_runtime_279;
create table public.remote_runtime_279 (
  case_no integer primary key,
  token text not null
);
insert into public.remote_runtime_279 (case_no, token)
values (279, 'PGDELTA_REMOTE_TOKEN_279');

create function public.probe_remote_279()
returns jsonb
language plpgsql
stable
security invoker
set search_path = ''
as $function$
begin
  raise sqlstate 'PT503'
    using message = 'REMOTE_UNAVAILABLE_279',
          detail = 'No remote request was attempted.',
          hint = 'Configure a local fixture before retrying.';
end
$function$;
revoke all on function public.probe_remote_279() from public;
grant execute on function public.probe_remote_279() to anon, authenticated;
notify pgrst, 'reload schema';
select pg_sleep(1);
select jsonb_build_object(
  'identity', 'public.remote_runtime_279'::regclass::oid,
  'valid',
    (select count(*) = 1 and bool_and(case_no = 279)
     from public.remote_runtime_279)
    and has_function_privilege(
          'anon', 'public.probe_remote_279()', 'EXECUTE')
)::text;
