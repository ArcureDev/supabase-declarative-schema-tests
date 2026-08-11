create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create table public.realtime_filtered_259 (
  id bigint primary key,
  tenant_id integer not null,
  payload text not null
);

alter publication supabase_realtime add table public.realtime_filtered_259;
