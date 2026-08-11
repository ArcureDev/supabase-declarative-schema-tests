-- pg_trgm is optional platform capability; absence must fail explicitly.
create extension if not exists pg_trgm with schema extensions;
