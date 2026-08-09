create schema fixture_secure;

create table fixture_secure.hidden_flags (
  id bigint generated always as identity primary key,
  flag text not null
);

create function fixture_secure.current_flag_count()
returns bigint
language sql
stable
security definer
set search_path = fixture_secure
as $$
  select count(*) from fixture_secure.hidden_flags;
$$;
