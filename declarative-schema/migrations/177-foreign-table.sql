create extension if not exists postgres_fdw;

create server fixture_table_server
foreign data wrapper postgres_fdw
options (host 'localhost', dbname 'postgres', port '5432');

create foreign table public.foreign_catalog_items (
  id bigint options (column_name 'id') not null,
  title text options (column_name 'title') not null
)
server fixture_table_server
options (schema_name 'public', table_name 'catalog_entries');
