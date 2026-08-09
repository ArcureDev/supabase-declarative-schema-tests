create unlogged table public.transient_imports (
  id bigint generated always as identity primary key,
  source_name text not null,
  payload jsonb not null,
  imported_at timestamptz not null default now()
);
