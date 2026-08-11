create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create table public.realtime_filtered_259 (
  id bigint primary key,
  tenant_id integer not null,
  payload text not null
);

alter publication supabase_realtime
set table public.realtime_filtered_259 (id, tenant_id)
where (tenant_id > 0);
