create table public.disabled_trigger_rows (
  id bigint generated always as identity primary key,
  body text not null,
  updated_at timestamptz not null default now()
);

create function public.touch_disabled_trigger_rows()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger disabled_trigger_rows_touch
before update on public.disabled_trigger_rows
for each row
execute function public.touch_disabled_trigger_rows();

alter table public.disabled_trigger_rows
  disable trigger disabled_trigger_rows_touch;
