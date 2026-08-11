create table public.transition_anchor (
  id bigint generated always as identity primary key,
  label text not null
);

create type public.transition_pair as (
  left_value integer,
  right_value integer
);

create type public.transition_int_span as range (
  subtype = integer
);

create table public.transition_shape_rows (
  id bigint generated always as identity primary key,
  payload public.transition_pair not null,
  span public.transition_int_span not null
);
