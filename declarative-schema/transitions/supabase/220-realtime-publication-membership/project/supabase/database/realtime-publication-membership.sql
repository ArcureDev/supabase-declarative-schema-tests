create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create table public.realtime_feed_220 (
  id bigint generated always as identity primary key,
  payload text not null
);
