create table public.service_boundary_anchor_254 (
  case_no integer primary key,
  payload text not null
);

insert into public.service_boundary_anchor_254 (case_no, payload)
values (254, 'auth-data-is-service-state');
