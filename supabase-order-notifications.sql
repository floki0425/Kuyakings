-- Kuya King's automated order-status notifications (email + SMS)
--
-- What this does: attaches a trigger to public.orders so that every time a
-- new order is placed, or an admin changes payment_status/order_status in
-- the dashboard, the customer automatically gets an email (via EmailJS) and
-- an SMS (via Semaphore, a Philippines SMS gateway). No backend server or
-- Supabase Edge Function needed -- the trigger calls both APIs directly
-- from Postgres using the pg_net extension.
--
-- BEFORE YOU RUN THIS, you need two free third-party accounts (you don't
-- have a custom domain yet, so these were picked specifically because
-- neither one requires domain verification):
--
-- 1) EmailJS (https://www.emailjs.com) -- lets you send email from your own
--    Gmail account to any customer, no domain needed.
--    - Sign up, then Email Services > Add New Service > connect your Gmail.
--    - Email Templates > Create Template. Set "To Email" to {{to_email}}.
--      Use {{to_name}}, {{order_number}}, and {{message}} in the body/subject.
--    - Account > General: copy your Public Key.
--    - Account > Security: copy your Private Key, and turn on "Allow
--      EmailJS API for non-browser applications" (needed because these
--      calls come from Postgres, not a browser).
--    - Copy the Service ID and Template ID from the service/template pages.
--
-- 2) Semaphore (https://semaphore.co) -- Philippines SMS API, pay-per-SMS
--    (roughly P0.50-1/message). Sign up, load credits, and copy your API Key
--    from the dashboard.
--
-- Once you have all 5 values, replace the 'REPLACE_WITH_...' placeholders
-- below before running this file. If you'd rather run this first and fill
-- in keys later, see the "update a secret later" note near the bottom.
--
-- Notifications never block or fail an order: if EmailJS/Semaphore is
-- unreachable or a key is wrong, the order still saves normally and the
-- notification is just silently skipped.

begin;

create extension if not exists pg_net;
create extension if not exists supabase_vault cascade;

-- Store provider keys encrypted in Supabase Vault (not as plain columns).
do $$
begin
  if not exists (select 1 from vault.secrets where name = 'emailjs_service_id') then
    perform vault.create_secret('REPLACE_WITH_EMAILJS_SERVICE_ID', 'emailjs_service_id');
  end if;
  if not exists (select 1 from vault.secrets where name = 'emailjs_template_id') then
    perform vault.create_secret('REPLACE_WITH_EMAILJS_TEMPLATE_ID', 'emailjs_template_id');
  end if;
  if not exists (select 1 from vault.secrets where name = 'emailjs_public_key') then
    perform vault.create_secret('REPLACE_WITH_EMAILJS_PUBLIC_KEY', 'emailjs_public_key');
  end if;
  if not exists (select 1 from vault.secrets where name = 'emailjs_private_key') then
    perform vault.create_secret('REPLACE_WITH_EMAILJS_PRIVATE_KEY', 'emailjs_private_key');
  end if;
  if not exists (select 1 from vault.secrets where name = 'semaphore_api_key') then
    perform vault.create_secret('REPLACE_WITH_SEMAPHORE_API_KEY', 'semaphore_api_key');
  end if;
end $$;

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
  v_semaphore_api_key text;
  v_message text;
  v_phone text;
begin
  if tg_op = 'INSERT' then
    v_message := format(
      'Hi %s! We received your Kuya King''s order #%s (%s x%s) for P%s. We will update you once it is confirmed. Salamat!',
      new.customer_name,
      new.order_number,
      coalesce(new.flavor, new.product_name, 'item'),
      new.quantity,
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
  select decrypted_secret into v_semaphore_api_key from vault.decrypted_secrets where name = 'semaphore_api_key';

  -- Email via EmailJS (skipped if the customer left no email, or keys aren't set yet)
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

  -- SMS via Semaphore (phone is required on every order)
  v_phone := regexp_replace(new.phone, '[^0-9]', '', 'g');

  if v_phone <> '' and coalesce(v_semaphore_api_key, '') not like 'REPLACE_%' then
    begin
      perform net.http_post(
        url := 'https://api.semaphore.co/api/v4/messages',
        headers := jsonb_build_object('Content-Type', 'application/json'),
        body := jsonb_build_object(
          'apikey', v_semaphore_api_key,
          'number', v_phone,
          'message', v_message
        )
      );
    exception when others then
      null;
    end;
  end if;

  return new;
end;
$$;

drop trigger if exists orders_notify_trigger on public.orders;

create trigger orders_notify_trigger
after insert or update on public.orders
for each row execute function public.notify_order_event();

commit;

-- To update a key later without re-running the whole file (e.g. you got
-- your real EmailJS keys after first running this with placeholders):
--   select vault.update_secret(id, 'your-real-value')
--   from vault.secrets where name = 'emailjs_service_id';
--
-- To confirm notifications are actually firing after a test order, check
-- the queued HTTP requests and their responses:
--   select * from net._http_response order by created desc limit 5;
-- A non-2xx status there means the provider rejected the request (wrong
-- key, unverified template, etc.) -- the error body will say why.
