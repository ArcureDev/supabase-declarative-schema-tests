create table public.imported_records (
  id bigint generated always as identity primary key,
  external_id text not null,
  constraint imported_records_external_id_key
    unique (external_id)
    deferrable initially deferred
);
