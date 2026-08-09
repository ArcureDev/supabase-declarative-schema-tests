create table public.org_units (
  id bigint generated always as identity primary key,
  parent_id bigint references public.org_units (id),
  name text not null
);

create recursive view public.org_unit_paths (id, parent_id, name, depth) as
select id, parent_id, name, 1
from public.org_units
where parent_id is null
union all
select child.id, child.parent_id, child.name, parent.depth + 1
from public.org_units as child
inner join org_unit_paths as parent
  on child.parent_id = parent.id;
