create table public.rename_ambiguity_source (
  id bigint primary key,
  payload text not null
);

insert into public.rename_ambiguity_source (id, payload)
values (1, 'must survive an ambiguous rename');
