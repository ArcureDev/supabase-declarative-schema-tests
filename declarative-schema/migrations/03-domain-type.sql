create domain public.positive_integer as integer
  check (value > 0);
