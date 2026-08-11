-- Invariant: captured extension versions are runtime evidence, not desired DDL.
insert into public.transition_anchor (case_no, payload)
values (280, 'case-280');

insert into public.extension_versions_280 (extname, extversion)
select extname, extversion
from pg_extension
where extname in ('pgcrypto', 'uuid-ossp', 'pg_trgm', 'unaccent');

insert into public.extension_items_280 (label)
values ('Café Déjà'), ('Cafe Delta');
