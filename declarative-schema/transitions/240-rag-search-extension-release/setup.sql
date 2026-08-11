insert into public.transition_anchor (id, payload)
values (240, 'rag-search-extension');

insert into app.catalog_items (
  id,
  title,
  description,
  facets
)
values (
  1,
  'PostgreSQL Search',
  'Hybrid catalog entry',
  '{"kind":"database"}'::jsonb
);

insert into app.documents (id, storage_object_key)
values (1, 'documents/one.txt');

insert into app.chunks (id, document_id, body, embedding)
values (1, 1, 'declarative schema', '[1,0,0]'::extensions.vector);
