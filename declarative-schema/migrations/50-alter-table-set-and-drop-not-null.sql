create table public.optional_labels (
  id bigint generated always as identity primary key,
  label text
);

alter table public.optional_labels
  alter column label set not null;

alter table public.optional_labels
  alter column label drop not null;
