# Kuya King's Security Setup

Use this checklist when you are ready to harden the live Supabase project.

## 1. Confirm frontend env values

The frontend should only use:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Never add a service role key or secret API key to any `VITE_` variable.

## 2. Mark the admin account

In Supabase, set the admin user's `app_metadata.role` to `admin`.

You can do it in the SQL Editor after replacing the email:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
  || jsonb_build_object('role', 'admin')
where email = 'kuyakings@admin.com';
```

After this, sign out and sign back in so the admin JWT refreshes.

## 3. Run the frontend setup SQL

Open `supabase-frontend-setup.sql` and run it in the Supabase SQL Editor first.

If you already use a custom schema, you can also apply the same policy rules from `supabase-security-hardening.sql`.

It enables:

- RLS for `orders` and `product_flavors`
- admin-only order management
- public product availability reads
- private `payment-proofs` storage
- public-read/admin-write `site-photos` storage
- a safe `track_order` RPC for customers

## 4. Check old policies

Remove any old broad policies that allow public `select`, `update`, or `delete`
on `orders`, or broad public access to `payment-proofs`.

## 5. Test the important flows

- Customer can place an order with a JPG, PNG, or WebP proof under 5 MB.
- Customer can track an order with order number plus phone.
- Anonymous users cannot list orders.
- Admin can log in, view orders, update statuses, and open proof images.
- Admin can upload brand photos.
- Non-admin authenticated users cannot manage orders or brand photos.
