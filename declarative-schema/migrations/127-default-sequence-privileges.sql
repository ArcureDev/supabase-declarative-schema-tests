create schema fixture_default_sequence_privs;

alter default privileges in schema fixture_default_sequence_privs
  grant usage, select on sequences to authenticated;
