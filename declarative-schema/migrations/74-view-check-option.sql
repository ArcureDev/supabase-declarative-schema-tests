create table public.editable_scores (
  id bigint generated always as identity primary key,
  score integer not null
);

create view public.positive_editable_scores as
select id, score
from public.editable_scores
where score > 0
with cascaded check option;
