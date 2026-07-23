-- Kuya King's Supabase security hardening
-- Run this in the Supabase SQL Editor after your orders and product_flavors
-- tables already exist. Review existing broad policies first, because any
-- older permissive policy can still allow access.

begin;

-- Admin users must have app_metadata.role = "admin".
-- Example, replace the email first, then sign out and sign back in:
-- update auth.users
-- set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
--   || jsonb_build_object('role', 'admin')
-- where email = 'kuyakings@admin.com';

create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path = public
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role' = 'admin', false);
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Reset app-table policies managed by this script.
do $$
declare
  policy_record record;
begin
  for policy_record in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('orders', 'product_flavors')
  loop
    execute format(
      'drop policy if exists %I on %I.%I',
      policy_record.policyname,
      policy_record.schemaname,
      policy_record.tablename
    );
  end loop;
end $$;

alter table public.orders enable row level security;
alter table public.product_flavors enable row level security;

create policy "orders_customer_insert"
on public.orders
for insert
to anon, authenticated
with check (
  length(trim(order_number)) between 8 and 40
  and length(trim(customer_name)) between 2 and 120
  and length(trim(phone)) between 7 and 30
  and length(trim(address)) between 5 and 500
  and length(trim(city)) between 2 and 120
  and quantity between 1 and 200
  and payment_method in ('GCash', 'Maya', 'Bank Transfer', 'COD')
  and delivery_option in (
    'Lalamove / Grab / Toktok',
    'Shipping courier',
    'Customer will book rider',
    'To be confirmed by owner'
  )
  and (
    payment_method = 'COD'
    or proof_of_payment_url ~ '^proofs/[a-z0-9-]+\.(jpg|jpeg|png|webp)$'
  )
);

create policy "orders_admin_all"
on public.orders
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "product_flavors_public_select"
on public.product_flavors
for select
to anon, authenticated
using (true);

create policy "product_flavors_admin_all"
on public.product_flavors
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create or replace function public.track_order(
  p_order_number text,
  p_phone text
)
returns table (
  order_number text,
  created_at timestamptz,
  payment_status text,
  order_status text,
  delivery_option text,
  product_name text,
  flavor text,
  quantity integer,
  subtotal numeric
)
language sql
security definer
set search_path = public
as $$
  select
    o.order_number::text,
    o.created_at::timestamptz,
    o.payment_status::text,
    o.order_status::text,
    o.delivery_option::text,
    o.product_name::text,
    o.flavor::text,
    o.quantity::integer,
    o.subtotal::numeric
  from public.orders as o
  where o.order_number = trim(p_order_number)
    and o.phone = trim(p_phone)
  order by o.created_at desc
  limit 1;
$$;

revoke all on function public.track_order(text, text) from public;
grant execute on function public.track_order(text, text) to anon, authenticated;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values
  (
    'payment-proofs',
    'payment-proofs',
    false,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'site-photos',
    'site-photos',
    true,
    8388608,
    array['image/jpeg', 'image/png', 'image/webp']
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "payment_proofs_insert_public" on storage.objects;
drop policy if exists "payment_proofs_admin_select" on storage.objects;
drop policy if exists "payment_proofs_admin_delete" on storage.objects;
drop policy if exists "site_photos_public_select" on storage.objects;
drop policy if exists "site_photos_admin_insert" on storage.objects;
drop policy if exists "site_photos_admin_update" on storage.objects;
drop policy if exists "site_photos_admin_delete" on storage.objects;

create policy "payment_proofs_insert_public"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'payment-proofs'
  and name ~ '^proofs/[a-z0-9-]+\.(jpg|jpeg|png|webp)$'
);

create policy "payment_proofs_admin_select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'payment-proofs'
  and public.is_admin()
);

create policy "payment_proofs_admin_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'payment-proofs'
  and public.is_admin()
);

create policy "site_photos_public_select"
on storage.objects
for select
to public
using (bucket_id = 'site-photos');

create policy "site_photos_admin_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'site-photos'
  and public.is_admin()
  and name ~ '^kuya-kings/(hero|product|gallery)/[a-z0-9-]+\.(jpg|jpeg|png|webp)$'
);

create policy "site_photos_admin_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'site-photos'
  and public.is_admin()
)
with check (
  bucket_id = 'site-photos'
  and public.is_admin()
  and name ~ '^kuya-kings/(hero|product|gallery)/[a-z0-9-]+\.(jpg|jpeg|png|webp)$'
);

create policy "site_photos_admin_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'site-photos'
  and public.is_admin()
);

commit;
