-- Invariant: CREATE OR REPLACE retains the wrapper OID and path probe row.
insert into public.transition_anchor values (256, 'storage-reference-helpers');
insert into public.storage_helper_probe_256 (id, object_name, helper_oid)
values (
  1,
  'private/user-256/avatar.final.png',
  'public.storage_path_facts_256(text)'::regprocedure::oid
);
