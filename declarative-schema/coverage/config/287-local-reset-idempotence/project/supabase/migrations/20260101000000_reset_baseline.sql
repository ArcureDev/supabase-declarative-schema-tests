-- The one-row baseline makes residual runtime data observable after every reset.
create table public.coverage_reset_probe (
  key text primary key,
  value integer not null
);
insert into public.coverage_reset_probe (key, value) values ('baseline', 1);
