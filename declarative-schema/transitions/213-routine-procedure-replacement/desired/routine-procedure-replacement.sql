create table public.transition_anchor (
  id bigint generated always as identity primary key,
  label text not null
);

create table public.transition_call_log (
  id bigint generated always as identity primary key,
  body text not null
);

create function public.transition_compute(input_value integer)
returns integer
language sql
immutable
strict
as $$
  select input_value + 2
$$;

create procedure public.transition_record(input_body text)
language sql
as $$
  insert into public.transition_call_log (body) values (upper(input_body))
$$;
