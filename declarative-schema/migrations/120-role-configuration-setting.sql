create role fixture_configured_role nologin;

alter role fixture_configured_role set statement_timeout = '10s';
