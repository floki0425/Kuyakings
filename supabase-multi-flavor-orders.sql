-- Kuya King's multi-flavor orders
--
-- What this does: lets one order contain multiple Tapa flavors (e.g. 2
-- Original + 1 Spicy) instead of exactly one flavor per order. Adds an
-- `items` jsonb column to public.orders holding an array of
-- {flavor, quantity, price_per_pack, subtotal} objects, alongside the
-- existing flat flavor/quantity/price_per_pack/subtotal columns, which now
-- represent an order-level summary/total rather than a single product.
--
-- Existing rows are unaffected: `items` defaults to '[]', and every reader
-- (frontend + this file's own functions) treats an empty/missing items
-- array as "this is a legacy single-flavor order" and falls back to the
-- old flat columns.
--
-- Safe to re-run.

begin;

alter table public.orders
  add column if not exists items jsonb not null default '[]'::jsonb;

-- Validates the shape of an items array: a JSON array of 0-20 objects,
-- each with a non-empty flavor name, a quantity between 1 and 200, and
-- non-negative price/subtotal numbers. Used by both the table-wide CHECK
-- (min_items = 0, so admin updates on legacy rows never fail) and the
-- customer insert policy below.
create or replace function public.valid_order_items(p_items jsonb, p_min_items integer default 0)
returns boolean
language sql
immutable
as $$
  select
    jsonb_typeof(p_items) = 'array'
    and jsonb_array_length(p_items) between p_min_items and 20
    and not exists (
      select 1
      from jsonb_array_elements(p_items) as elem
      where not (
        jsonb_typeof(elem) = 'object'
        and (elem ? 'flavor') and jsonb_typeof(elem->'flavor') = 'string'
          and length(trim(elem->>'flavor')) between 1 and 120
        and (elem ? 'quantity') and jsonb_typeof(elem->'quantity') = 'number'
          and (elem->>'quantity')::numeric between 1 and 200
        and (elem ? 'price_per_pack') and jsonb_typeof(elem->'price_per_pack') = 'number'
          and (elem->>'price_per_pack')::numeric between 0 and 100000
        and (elem ? 'subtotal') and jsonb_typeof(elem->'subtotal') = 'number'
          and (elem->>'subtotal')::numeric between 0 and 2000000
      )
    );
$$;

alter table public.orders drop constraint if exists orders_items_shape_check;
alter table public.orders
  add constraint orders_items_shape_check
  check (public.valid_order_items(items, 0));

-- Re-create the customer insert policy: identical to the currently-live
-- version (length bounds, payment_method whitelist, per-phone rate limit)
-- plus the new items-shape check. "At least one item" is intentionally
-- NOT enforced here -- see the header comment in the project's
-- implementation notes; it's a client-side-only validation so a stray
-- request from a not-yet-updated cached frontend can't get rejected.
drop policy if exists "orders_customer_insert" on public.orders;
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
  and public.valid_order_items(items, 0)
  and public.order_rate_limit_ok(phone)
);

-- track_order()'s return shape is changing (adding `items`), so it must be
-- dropped first -- Postgres rejects CREATE OR REPLACE across a return-type
-- change.
drop function if exists public.track_order(text, text);

create function public.track_order(
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
  subtotal numeric,
  items jsonb
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
    o.subtotal::numeric,
    o.items
  from public.orders as o
  where o.order_number = trim(p_order_number)
    and o.phone = trim(p_phone)
  order by o.created_at desc
  limit 1;
$$;

revoke all on function public.track_order(text, text) from public;
grant execute on function public.track_order(text, text) to anon, authenticated;

-- Notification trigger: build the order-confirmation message from
-- new.items when present, falling back to the legacy single-flavor
-- phrasing for pre-migration rows (items = '[]'). Only the INSERT branch
-- and the message-building logic change; UPDATE-triggered status messages
-- and the EmailJS call itself are unchanged.
create or replace function public.notify_order_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_emailjs_service_id text;
  v_emailjs_template_id text;
  v_emailjs_public_key text;
  v_emailjs_private_key text;
  v_message text;
  v_items_summary text;
begin
  if tg_op = 'INSERT' then
    if jsonb_array_length(coalesce(new.items, '[]'::jsonb)) > 0 then
      select string_agg(format('%s x%s', elem->>'flavor', elem->>'quantity'), ', ')
        into v_items_summary
      from jsonb_array_elements(new.items) as elem;
    else
      v_items_summary := format('%s x%s', coalesce(new.flavor, new.product_name, 'item'), new.quantity);
    end if;

    v_message := format(
      'Hi %s! We received your Kuya King''s order #%s (%s) for P%s. We will update you once it is confirmed. Salamat!',
      new.customer_name,
      new.order_number,
      v_items_summary,
      to_char(new.subtotal, 'FM999,999,990.00')
    );
  elsif tg_op = 'UPDATE'
    and (new.order_status is distinct from old.order_status
      or new.payment_status is distinct from old.payment_status) then
    if new.order_status is distinct from old.order_status
      and new.payment_status is distinct from old.payment_status then
      v_message := format(
        'Hi %s, update on Kuya King''s order #%s: payment is now "%s" and order status is now "%s".',
        new.customer_name, new.order_number, new.payment_status, new.order_status
      );
    elsif new.payment_status is distinct from old.payment_status then
      v_message := format(
        'Hi %s, payment update for Kuya King''s order #%s: %s.',
        new.customer_name, new.order_number, new.payment_status
      );
    else
      v_message := format(
        'Hi %s, update on Kuya King''s order #%s: %s.',
        new.customer_name, new.order_number, new.order_status
      );
    end if;
  else
    return new;
  end if;

  select decrypted_secret into v_emailjs_service_id from vault.decrypted_secrets where name = 'emailjs_service_id';
  select decrypted_secret into v_emailjs_template_id from vault.decrypted_secrets where name = 'emailjs_template_id';
  select decrypted_secret into v_emailjs_public_key from vault.decrypted_secrets where name = 'emailjs_public_key';
  select decrypted_secret into v_emailjs_private_key from vault.decrypted_secrets where name = 'emailjs_private_key';

  if new.email is not null and coalesce(v_emailjs_service_id, '') not like 'REPLACE_%' then
    begin
      perform net.http_post(
        url := 'https://api.emailjs.com/api/v1.0/email/send',
        headers := jsonb_build_object('Content-Type', 'application/json'),
        body := jsonb_build_object(
          'service_id', v_emailjs_service_id,
          'template_id', v_emailjs_template_id,
          'user_id', v_emailjs_public_key,
          'accessToken', v_emailjs_private_key,
          'template_params', jsonb_build_object(
            'to_email', new.email,
            'to_name', new.customer_name,
            'order_number', new.order_number,
            'message', v_message
          )
        )
      );
    exception when others then
      null; -- never block the order write because a notification failed
    end;
  end if;

  return new;
end;
$$;

commit;
