create table public.threshold_events (
  id bigint generated always as identity primary key,
  score integer not null,
  flagged boolean not null default false
);

create function public.flag_high_threshold_event()
returns trigger
language plpgsql
as $$
begin
  new.flagged = true;
  return new;
end;
$$;

create trigger threshold_events_flag_high_score
before insert or update on public.threshold_events
for each row
when (new.score >= 100)
execute function public.flag_high_threshold_event();
