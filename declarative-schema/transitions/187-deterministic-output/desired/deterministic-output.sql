create table public.deterministic_output_anchor (
  id bigint primary key,
  payload text not null
);

create table public.deterministic_output_parent (
  id bigint primary key,
  code text not null unique
);

create table public.deterministic_output_child (
  id bigint primary key,
  parent_id bigint not null
    references public.deterministic_output_parent (id)
    on delete cascade,
  payload text not null
);

create index deterministic_output_child_payload_idx
on public.deterministic_output_child (payload);
