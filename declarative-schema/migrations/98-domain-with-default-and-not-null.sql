create domain public.nonempty_label as text
  not null
  default 'untitled'
  check (length(value) > 0);
