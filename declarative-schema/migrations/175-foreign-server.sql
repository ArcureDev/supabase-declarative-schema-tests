create extension if not exists postgres_fdw;

create server fixture_foreign_server
foreign data wrapper postgres_fdw
options (host 'localhost', dbname 'postgres', port '5432');
