-- Invariant: SQL owns only runtime bucket data; Storage owns object rows.
insert into storage.buckets (id, name, public)
values ('coverage-257', 'coverage-257', false)
on conflict (id) do update set public = excluded.public;

select jsonb_build_object(
  'valid',
  exists (
    select 1 from storage.buckets
    where id = 'coverage-257' and name = 'coverage-257' and not public
  )
)::text;
