create table public.transition_anchor (
  case_no integer primary key,
  payload text not null
);

create table public.storage_policy_identity_255 (
  policy_name text primary key,
  policy_oid oid not null
);

create policy storage_select_255
on storage.objects for select to authenticated
using (
  bucket_id = 'matrix-255'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy storage_insert_255
on storage.objects for insert to authenticated
with check (
  bucket_id = 'matrix-255'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy storage_update_255
on storage.objects for update to authenticated
using (
  bucket_id = 'matrix-255'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'matrix-255'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy storage_delete_255
on storage.objects for delete to authenticated
using (
  bucket_id = 'matrix-255'
  and (storage.foldername(name))[1] = auth.uid()::text
);
