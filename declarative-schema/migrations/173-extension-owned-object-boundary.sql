create schema if not exists extensions;

create extension if not exists pgcrypto
with schema extensions;

create table public.extension_boundary_items (
  id uuid primary key default extensions.gen_random_uuid(),
  label text not null
);
