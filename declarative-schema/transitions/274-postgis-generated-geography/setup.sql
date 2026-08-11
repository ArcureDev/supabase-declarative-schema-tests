-- Invariant: generated geography must backfill existing coordinate rows.
insert into public.transition_anchor (case_no, payload)
values (274, 'case-274');

insert into public.generated_places_274 (name, longitude, latitude)
values
  ('Amsterdam', 4.9041, 52.3676),
  ('Paris', 2.3522, 48.8566);
