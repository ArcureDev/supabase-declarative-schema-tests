create table public.transition_anchor (
  id bigint generated always as identity primary key,
  label text not null
);

create table public.transition_trigger_source (
  id bigint generated always as identity primary key,
  body text not null
);

create table public.transition_trigger_log (
  id bigint generated always as identity primary key,
  entry text not null
);

create function public.transition_capture_row()
returns trigger
language plpgsql
as $$
begin
  insert into public.transition_trigger_log (entry)
  values ('v1:' || new.body);
  return new;
end
$$;

create trigger transition_capture
after insert on public.transition_trigger_source
for each row
execute function public.transition_capture_row();
