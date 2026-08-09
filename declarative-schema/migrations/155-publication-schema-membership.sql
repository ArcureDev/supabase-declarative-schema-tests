create schema fixture_publication_schema;

create table fixture_publication_schema.schema_items (
  id bigint generated always as identity primary key,
  payload text not null
);

create publication fixture_schema_publication
for tables in schema fixture_publication_schema;
