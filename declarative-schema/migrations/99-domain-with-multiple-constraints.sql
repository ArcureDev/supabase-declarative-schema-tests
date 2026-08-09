create domain public.bounded_score as integer
  constraint bounded_score_min check (value >= 0)
  constraint bounded_score_max check (value <= 100);
