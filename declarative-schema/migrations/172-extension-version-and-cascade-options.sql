create schema if not exists extensions;

create extension if not exists "uuid-ossp"
with schema extensions
version '1.1'
cascade;
