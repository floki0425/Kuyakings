-- Kuya King's frontend Supabase setup
-- Run this in the Supabase SQL Editor to make the React app work with the
-- live project URL and anon key.

reset role;


begin;

create extension if not exists pgcrypto;

create table if not exists public.product_flavors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  is_available boolean not null default true,
  sort_order integer not null default 0,
  price numeric(10,2) not null default 300,
  created_at timestamptz not null default now()
);

alter table public.product_flavors
  add column if not exists price numeric(10,2) not null default 300;

alter table public.product_flavors
  add column if not exists image_url text;

alter table public.product_flavors
  add column if not exists description text not null default '';

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text,
  description text,
  price numeric(10,2) not null default 300,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  flavor text,
  quantity integer not null default 1,
  price_per_pack numeric(10,2) not null default 300,
  payment_method text not null,
  delivery_option text,
  proof_of_payment_url text,
  customer_name text not null,
  phone text not null,
  email text,
  address text not null,
  city text not null,
  landmark text,
  notes text,
  payment_status text not null default 'Pending',
  order_status text not null default 'New Order',
  subtotal numeric(10,2) not null default 0,
  product_name text,
  created_at timestamptz not null default now()
);

alter table public.orders
  add column if not exists price_per_pack numeric(10,2) not null default 300;

alter table public.orders
  alter column price_per_pack set default 300;

alter table public.products
  alter column price set default 300;

-- Rename legacy flavor names to the current product lineup, if present.
update public.product_flavors set name = 'Original', price = 300
where lower(name) = 'plain';

update public.product_flavors set name = 'Spicy', price = 310
where lower(name) = 'chili';

insert into public.product_flavors (name, is_available, sort_order, price, description)
select seed.name, seed.is_available, seed.sort_order, seed.price, seed.description
from (
  values
    ('Original'::text, true, 1, 300::numeric(10,2), 'Our classic homemade recipe — tender beef marinated in our signature blend for that rich, savory flavor you already know and love.'::text),
    ('Spicy'::text, true, 2, 310::numeric(10,2), 'All the same homemade flavor, with extra heat. Marinated using our signature recipe, then finished with a spicy kick for those who like it hot.'::text),
    ('Bundle (3 Jars - Any Flavor)'::text, true, 3, 900::numeric(10,2), 'Can''t decide? Get three jars in any mix of Original and Spicy — perfect for sharing, gifting, or stocking up.'::text)
) as seed(name, is_available, sort_order, price, description)
where not exists (
  select 1
  from public.product_flavors existing
  where lower(existing.name) = lower(seed.name)
);

-- Backfill descriptions for the default flavors on databases that already
-- had these rows before the description column existed.
update public.product_flavors set description = 'Our classic homemade recipe — tender beef marinated in our signature blend for that rich, savory flavor you already know and love.'
where lower(name) = 'original' and coalesce(description, '') = '';

update public.product_flavors set description = 'All the same homemade flavor, with extra heat. Marinated using our signature recipe, then finished with a spicy kick for those who like it hot.'
where lower(name) = 'spicy' and coalesce(description, '') = '';

update public.product_flavors set description = 'Can''t decide? Get three jars in any mix of Original and Spicy — perfect for sharing, gifting, or stocking up.'
where lower(name) like 'bundle%' and coalesce(description, '') = '';

insert into public.products (name, slug, description, price, is_available)
select
  'Kuya King''s Beef Tapa',
  'kuya-kings-beef-tapa',
  'Homemade beef tapa prepared in small batches.',
  300,
  true
where not exists (
  select 1
  from public.products
  where slug = 'kuya-kings-beef-tapa'
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_admin boolean not null default false,
  full_name text,
  created_at timestamptz not null default now()
);

-- Tracks which uploaded photo is currently live for each homepage/order slot
-- (hero, product, gallery), so the public site and every admin device agree
-- on the current photo instead of relying on a single browser's storage.
create table if not exists public.site_photo_slots (
  slot text primary key,
  url text not null,
  updated_at timestamptz not null default now()
);

-- GCash, Maya, and bank transfer details shown to customers at checkout.
-- Admin-editable from /admin/payment-settings instead of hardcoded in source.
create table if not exists public.payment_settings (
  method text primary key check (method in ('gcash', 'maya', 'bank')),
  account_name text not null default '',
  account_number text not null default '',
  bank_name text not null default '',
  qr_code_url text,
  updated_at timestamptz not null default now()
);

alter table public.payment_settings
  add column if not exists qr_code_url text;

insert into public.payment_settings (method)
select seed.method
from (values ('gcash'::text), ('maya'::text), ('bank'::text)) as seed(method)
where not exists (
  select 1 from public.payment_settings existing where existing.method = seed.method
);

-- Admin-editable text snippets (e.g. Perfect Pair titles/descriptions) that
-- would otherwise be hardcoded in source. Generic key/value store so new
-- editable copy can be added without a schema change.
create table if not exists public.site_text_content (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

-- Messages submitted through the public Contact Us form.
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path = public
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role' = 'admin', false);
$$;

grant execute on function public.is_admin() to authenticated;

-- Anti-spam rate limits, enforced in the database (not just the frontend)
-- so they can't be bypassed by calling the Supabase API directly. Both are
-- security definer so the count query works even though anon/authenticated
-- have no select policy on these tables (RLS would otherwise hide every row
-- from the subquery and make count() always return 0).
create or replace function public.contact_rate_limit_ok(p_email text, p_phone text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select count(*) < 3
  from public.contact_messages
  where created_at > now() - interval '10 minutes'
    and (
      (p_email is not null and email = p_email)
      or (p_phone is not null and phone = p_phone)
    );
$$;

grant execute on function public.contact_rate_limit_ok(text, text) to anon, authenticated;

create or replace function public.order_rate_limit_ok(p_phone text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select count(*) < 5
  from public.orders
  where created_at > now() - interval '15 minutes'
    and phone = p_phone;
$$;

grant execute on function public.order_rate_limit_ok(text) to anon, authenticated;

alter table public.product_flavors enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.profiles enable row level security;
alter table public.site_photo_slots enable row level security;
alter table public.payment_settings enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_text_content enable row level security;

drop policy if exists "product_flavors_public_select" on public.product_flavors;
drop policy if exists "product_flavors_admin_all" on public.product_flavors;
drop policy if exists "products_public_select" on public.products;
drop policy if exists "products_admin_all" on public.products;
drop policy if exists "orders_customer_insert" on public.orders;
drop policy if exists "orders_admin_all" on public.orders;
drop policy if exists "orders_user_select" on public.orders;
drop policy if exists "profiles_user_select" on public.profiles;
drop policy if exists "profiles_admin_all" on public.profiles;
drop policy if exists "site_photo_slots_public_select" on public.site_photo_slots;
drop policy if exists "site_photo_slots_admin_all" on public.site_photo_slots;
drop policy if exists "payment_settings_public_select" on public.payment_settings;
drop policy if exists "payment_settings_admin_all" on public.payment_settings;
drop policy if exists "contact_messages_public_insert" on public.contact_messages;
drop policy if exists "contact_messages_admin_all" on public.contact_messages;
drop policy if exists "site_text_content_public_select" on public.site_text_content;
drop policy if exists "site_text_content_admin_all" on public.site_text_content;

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

create policy "products_public_select"
on public.products
for select
to anon, authenticated
using (true);

create policy "products_admin_all"
on public.products
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

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
  and public.order_rate_limit_ok(phone)
);

create policy "orders_user_select"
on public.orders
for select
to authenticated
using (public.is_admin());

create policy "orders_admin_all"
on public.orders
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "profiles_user_select"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "profiles_admin_all"
on public.profiles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "site_photo_slots_public_select"
on public.site_photo_slots
for select
to anon, authenticated
using (true);

create policy "site_photo_slots_admin_all"
on public.site_photo_slots
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "payment_settings_public_select"
on public.payment_settings
for select
to anon, authenticated
using (true);

create policy "payment_settings_admin_all"
on public.payment_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "contact_messages_public_insert"
on public.contact_messages
for insert
to anon, authenticated
with check (
  length(trim(name)) between 2 and 120
  and length(trim(message)) between 5 and 2000
  and (email is not null or phone is not null)
  and (email is null or length(trim(email)) between 3 and 200)
  and (phone is null or length(trim(phone)) between 7 and 30)
  and public.contact_rate_limit_ok(email, phone)
);

create policy "contact_messages_admin_all"
on public.contact_messages
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "site_text_content_public_select"
on public.site_text_content
for select
to anon, authenticated
using (true);

create policy "site_text_content_admin_all"
on public.site_text_content
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('payment-proofs', 'payment-proofs', false, 5242880, array['image/jpeg','image/png','image/webp']),
  ('site-photos', 'site-photos', true, 8388608, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
set public = excluded.public,
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
using (bucket_id = 'payment-proofs' and public.is_admin());

create policy "payment_proofs_admin_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'payment-proofs' and public.is_admin());

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
  and name ~ '^kuya-kings/(hero|product|gallery|story|pairing-rice|pairing-atchara|cta|cta-background|about|process-page|flavor-[0-9a-f-]{36}|qr-gcash|qr-maya|qr-bank)/[a-z0-9-]+\.(jpg|jpeg|png|webp)$'
);

create policy "site_photos_admin_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'site-photos' and public.is_admin())
with check (
  bucket_id = 'site-photos'
  and public.is_admin()
  and name ~ '^kuya-kings/(hero|product|gallery|story|pairing-rice|pairing-atchara|cta|cta-background|about|process-page|flavor-[0-9a-f-]{36}|qr-gcash|qr-maya|qr-bank)/[a-z0-9-]+\.(jpg|jpeg|png|webp)$'
);

create policy "site_photos_admin_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'site-photos' and public.is_admin());

commit;
