create function public.double_integer(value integer)
returns integer
language plpgsql
immutable
strict
as $$
begin
  return value * 2;
end;
$$;
