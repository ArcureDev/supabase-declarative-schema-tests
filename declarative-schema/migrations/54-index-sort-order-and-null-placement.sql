create table public.ranked_tasks (
  id bigint generated always as identity primary key,
  priority integer,
  title text not null
);

create index ranked_tasks_priority_title_idx
on public.ranked_tasks (priority desc nulls last, title asc nulls first);
