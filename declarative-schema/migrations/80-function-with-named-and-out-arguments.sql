create function public.split_full_name(
  full_name text,
  out first_name text,
  out last_name text
)
language plpgsql
immutable
strict
as $$
begin
  first_name := split_part(full_name, ' ', 1);
  last_name := nullif(substr(full_name, length(first_name) + 2), '');
end;
$$;
