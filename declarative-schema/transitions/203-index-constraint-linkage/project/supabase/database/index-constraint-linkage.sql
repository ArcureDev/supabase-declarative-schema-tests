create table public.transition_anchor (
  id integer primary key,
  payload text not null
);

create table public.constraint_attach (
  id bigint primary key,
  external_id text not null,
  retired_code text not null,
  search_text text not null,
  constraint constraint_attach_retired_key unique (retired_code)
);

create unique index constraint_attach_external_uidx
  on public.constraint_attach (external_id);

create index constraint_attach_search_old_idx
  on public.constraint_attach (lower(search_text));
