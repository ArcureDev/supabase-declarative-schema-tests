-- Invariant: every populated vector is compatible with the desired dimension.
insert into public.transition_anchor (case_no, payload)
values (272, 'case-272');

insert into public.vector_dimensions_272 (embedding, label)
values
  ('[1,0,0,0]'::extensions.vector, 'north'),
  ('[0,1,0,0]'::extensions.vector, 'east');
