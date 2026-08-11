insert into public.transition_anchor (case_no, payload)
values (234, 'case-234');

insert into public.places_234 (name, location)
values
  (
    'Amsterdam',
    extensions.st_setsrid(extensions.st_makepoint(4.9041, 52.3676), 4326)
      ::extensions.geography
  ),
  (
    'Paris',
    extensions.st_setsrid(extensions.st_makepoint(2.3522, 48.8566), 4326)
      ::extensions.geography
  );
