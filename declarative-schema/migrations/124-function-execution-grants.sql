create function public.grantable_add(left_value integer, right_value integer)
returns integer
language sql
immutable
strict
as $$
  select left_value + right_value;
$$;

revoke all on function public.grantable_add(integer, integer) from public;
grant execute on function public.grantable_add(integer, integer) to authenticated;
