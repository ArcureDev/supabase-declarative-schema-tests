-- Invariant: representative vectors exist before index replacement.
insert into public.transition_anchor (case_no, payload)
values (273, 'case-273');

insert into public.vector_ivfflat_items_273 (embedding, label)
values
  ('[1,0,0]'::extensions.vector, 'one'),
  ('[0,1,0]'::extensions.vector, 'two'),
  ('[0,0,1]'::extensions.vector, 'three');
