create role fixture_group_parent nologin;
create role fixture_group_member nologin;

grant fixture_group_parent to fixture_group_member;
