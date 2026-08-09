create schema fixture_default_table_privs;

alter default privileges in schema fixture_default_table_privs
  grant select on tables to authenticated;
