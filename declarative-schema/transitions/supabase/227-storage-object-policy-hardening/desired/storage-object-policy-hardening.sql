create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create policy transition_storage_insert_227
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'transition-227'
  and (storage.foldername(name))[1] = (select auth.jwt()->>'sub')
);
