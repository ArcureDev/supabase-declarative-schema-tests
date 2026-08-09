create table public.transition_rows (
  id bigint generated always as identity primary key,
  body text not null
);

create table public.transition_row_counts (
  id bigint generated always as identity primary key,
  inserted_count integer not null
);

create function public.record_transition_row_count()
returns trigger
language plpgsql
as $$
begin
  insert into public.transition_row_counts (inserted_count)
  select count(*)::integer from new_rows;
  return null;
end;
$$;

create trigger transition_rows_after_insert
after insert on public.transition_rows
referencing new table as new_rows
for each statement
execute function public.record_transition_row_count();
