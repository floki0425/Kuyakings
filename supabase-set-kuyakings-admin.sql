-- One-time admin assignment for Kuya King's.
-- Run this file in the Supabase SQL Editor for the configured project.

begin;

do $$
declare
  target_user_id uuid;
begin
  select id
  into target_user_id
  from auth.users
  where lower(email) = lower('kuyakings@admin.com')
  limit 1;

  if target_user_id is null then
    raise exception 'No Supabase Auth user exists for kuyakings@admin.com';
  end if;

  update auth.users
  set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
    || jsonb_build_object('role', 'admin')
  where id = target_user_id;

  insert into public.profiles (id, is_admin)
  values (target_user_id, true)
  on conflict (id) do update
  set is_admin = true;
end
$$;

commit;
