create table public.truncate_targets (
  id bigint generated always as identity primary key,
  body text not null
);

create table public.truncate_audit (
  id bigint generated always as identity primary key,
  truncated_at timestamptz not null default now()
);

create function public.record_truncate_audit()
returns trigger
language plpgsql
as $$
begin
  insert into public.truncate_audit default values;
  return null;
end;
$$;

create trigger truncate_targets_after_truncate
after truncate on public.truncate_targets
for each statement
execute function public.record_truncate_audit();
