create table public.teams (
  id bigint generated always as identity primary key,
  name text not null
);

create table public.team_members (
  id bigint generated always as identity primary key,
  team_id bigint not null,
  display_name text not null,
  constraint team_members_team_id_fkey
    foreign key (team_id)
    references public.teams (id)
    on update cascade
    on delete cascade
);
