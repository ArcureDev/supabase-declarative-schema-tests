create function public.int4_custom_cmp(a integer, b integer)
returns integer
language sql
immutable
strict
as $$
  select case
    when a < b then -1
    when a > b then 1
    else 0
  end;
$$;

create operator class public.int4_custom_ops
for type integer using btree as
  operator 1 <(integer, integer),
  operator 2 <=(integer, integer),
  operator 3 =(integer, integer),
  operator 4 >=(integer, integer),
  operator 5 >(integer, integer),
  function 1 public.int4_custom_cmp(integer, integer);
