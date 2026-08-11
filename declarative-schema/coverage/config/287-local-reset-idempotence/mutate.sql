-- This row must never survive a subsequent local reset.
insert into public.coverage_reset_probe (key, value) values ('runtime-only', 2);
