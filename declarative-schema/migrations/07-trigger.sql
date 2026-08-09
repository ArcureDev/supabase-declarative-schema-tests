create table public.notes (
  id bigint generated always as identity primary key,
  body text not null,
  updated_at timestamptz not null default now()
);

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger notes_set_updated_at
before update on public.notes
for each row
execute function public.set_updated_at();
