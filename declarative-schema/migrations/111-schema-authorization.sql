create role fixture_schema_owner nologin;

grant fixture_schema_owner to current_user;

create schema fixture_authorized authorization fixture_schema_owner;
