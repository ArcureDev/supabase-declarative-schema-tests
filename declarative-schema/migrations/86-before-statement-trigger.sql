create table public.statement_guarded_rows (
  id bigint generated always as identity primary key,
  body text not null
);

create function public.reject_statement_guarded_insert()
returns trigger
language plpgsql
as $$
begin
  raise exception 'statement inserts are blocked';
end;
$$;

create trigger statement_guarded_rows_before_insert
before insert on public.statement_guarded_rows
for each statement
execute function public.reject_statement_guarded_insert();
