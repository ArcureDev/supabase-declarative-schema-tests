create schema fixture_default_function_privs;

alter default privileges in schema fixture_default_function_privs
  grant execute on functions to authenticated;
