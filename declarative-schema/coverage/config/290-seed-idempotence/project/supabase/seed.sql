-- Upsert is the safety invariant: repeated seeding cannot duplicate reference data.
insert into public.coverage_reference_data (key, label, revision)
values ('primary', 'Seeded reference', 1)
on conflict (key) do update
set label = excluded.label,
    revision = excluded.revision;
