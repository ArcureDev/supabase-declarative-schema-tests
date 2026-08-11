create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create extension if not exists postgres_fdw;
create server transition_server_224
  foreign data wrapper postgres_fdw
  options (host 'alpha.invalid', dbname 'postgres', port '5432');
create user mapping for current_user
  server transition_server_224
  options (user 'postgres');
