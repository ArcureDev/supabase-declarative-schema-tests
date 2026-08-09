create extension if not exists postgres_fdw;

create server fixture_mapped_server
foreign data wrapper postgres_fdw
options (host 'localhost', dbname 'postgres', port '5432');

create user mapping for current_user
server fixture_mapped_server
options (user 'postgres', password 'postgres');
