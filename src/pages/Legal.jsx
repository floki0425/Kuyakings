import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SEO from "../components/seo/SEO";
import Reveal from "../components/common/Reveal";
import { brand } from "../lib/constants";
import { breadcrumbJsonLd } from "../lib/seo";

const LAST_UPDATED = "July 22, 2026";

const sections = [
  { id: "privacy-policy", label: "Privacy Policy" },
  { id: "terms-conditions", label: "Terms & Conditions" },
  { id: "refund-policy", label: "Refund & Cancellation" },
];

function LegalSection({ id, title, children }) {
  return (
    <Reveal as="section" id={id}>
      <h2 className="font-serif text-2xl font-bold text-[#17191C] min-[421px]:text-3xl">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-[#5F5B58] min-[421px]:text-base">
        {children}
      </div>
    </Reveal>
  );
}

function SubHeading({ children }) {
  return <h3 className="font-black text-[#17191C]">{children}</h3>;
}

function Legal() {
  return (
    <main className="min-h-screen bg-[#FFF7F2] text-[#17191C]">
      <SEO
        title="Privacy Policy & Terms"
        description={`Kuya King's Beef Tapa privacy policy, terms & conditions, and refund policy.`}
        path="/legal"
        jsonLd={({ canonicalUrl }) =>
          breadcrumbJsonLd([
            { name: "Home", url: canonicalUrl.replace(/\/legal$/, "/") },
            { name: "Legal", url: canonicalUrl },
          ])
        }
      />
      <Header />

      <section className="border-b border-[#E8E1DE] bg-[#FFFDFC] px-5 py-14 min-[421px]:py-16 lg:py-20">
        <div className="kk-fade-in mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-widest text-[#C91F3A]">
            Legal
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold leading-[1.05] text-[#17191C] min-[421px]:text-5xl">
            Privacy, Terms &amp; Refund Policy
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#5F5B58]">
            How {brand.shortName} collects and uses your information, and what
            to expect when you order, cancel, or request a refund.
          </p>

          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-[#8a8580]">
            Last updated: {LAST_UPDATED}
          </p>

          <nav
            aria-label="Legal sections"
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
          >
            {sections.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="rounded-full border border-[#E8E1DE] bg-white px-4 py-2 text-xs font-black text-[#17191C] transition hover:border-[#c91f3a] hover:text-[#c91f3a]"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section className="px-5 py-14 min-[421px]:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl space-y-14">
          <LegalSection id="privacy-policy" title="Privacy Policy">
            <p>
              This policy explains what information {brand.name} collects when
              you order through this website, why we collect it, and how it's
              kept safe.
            </p>

            <SubHeading>What we collect</SubHeading>
            <p>
              When you place an order, we collect your name, phone number,
              delivery address, and order details (product, quantity, payment
              method). Email is optional. If you pay via GCash, Maya, or Bank
              Transfer, we also collect the proof-of-payment screenshot or
              photo you upload to confirm your order.
            </p>

            <SubHeading>How we use it</SubHeading>
            <ul className="list-disc space-y-2 pl-5">
              <li>To prepare, confirm, and deliver your order.</li>
              <li>
                To send you order confirmations and status updates by SMS
                and/or email.
              </li>
              <li>To verify payment and respond to order-related questions.</li>
            </ul>

            <SubHeading>Who we share it with</SubHeading>
            <p>
              We don't sell your personal information. To run the business,
              we share the minimum needed with a few trusted service
              providers: Supabase (secure database and file storage), EmailJS
              (sending order emails), and Semaphore (sending order SMS).
              Payment-proof images are visible only to {brand.shortName}{" "}
              admin, never published publicly.
            </p>

            <SubHeading>Your rights</SubHeading>
            <p>
              Under the Philippine Data Privacy Act of 2012 (RA 10173), you
              can ask us for a copy of the information we hold about you, ask
              us to correct or delete it, or ask us to stop contacting you.
              Message us on Facebook or at the phone number in the footer to
              make a request.
            </p>

            <SubHeading>Data retention</SubHeading>
            <p>
              We keep order records only as long as needed for order
              fulfillment, customer support, and basic bookkeeping.
            </p>

            <SubHeading>Changes to this policy</SubHeading>
            <p>
              We may update this page occasionally. The "Last updated" date
              above will change whenever we do.
            </p>
          </LegalSection>

          <LegalSection id="terms-conditions" title="Terms & Conditions">
            <p>
              These terms govern your use of this website and the process of
              ordering from {brand.shortName}.
            </p>

            <SubHeading>Orders</SubHeading>
            <p>
              Placing an order through the site is a request to purchase.
              We'll confirm your order once your payment is verified (or, for
              Cash on Delivery, once we've reviewed the order details).
            </p>

            <SubHeading>Pricing</SubHeading>
            <p>
              All prices are listed in Philippine Peso and may change without
              prior notice. The price shown at the time you place your order
              is the price you'll be charged.
            </p>

            <SubHeading>Payment</SubHeading>
            <p>
              We accept GCash, Maya, Bank Transfer, and Cash on Delivery
              (COD), as shown at checkout. For GCash, Maya, and Bank
              Transfer, a proof of payment upload is required, and your order
              is confirmed only after we verify it.
            </p>

            <SubHeading>Delivery</SubHeading>
            <p>
              Delivery areas, timing, and fees are arranged directly with you
              after your order is placed. Delivery times are estimates, not
              guarantees.
            </p>

            <SubHeading>Availability</SubHeading>
            <p>
              Flavors and bundles shown as available may sell out between the
              time you order and the time we confirm it. We'll contact you
              right away if anything in your order isn't available.
            </p>

            <SubHeading>Changes and cancellations</SubHeading>
            <p>
              Contact us as soon as possible if you need to change or cancel
              an order. Once we've started preparing it, we may no longer be
              able to cancel — see the Refund Policy below.
            </p>
          </LegalSection>

          <LegalSection id="refund-policy" title="Refund & Cancellation Policy">
            <p>
              Kuya King's Beef Tapa is a fresh, homemade food product, so we
              don't accept returns once an order has been delivered, except
              as described below.
            </p>

            <SubHeading>Wrong, damaged, or spoiled items</SubHeading>
            <p>
              If you receive the wrong product, or it arrives visibly damaged
              or spoiled, message us within 24 hours of delivery with a photo.
              We'll arrange a replacement or a refund.
            </p>

            <SubHeading>Cancelling before we start preparing</SubHeading>
            <p>You'll get a full refund if you cancel before we've started preparing your order.</p>

            <SubHeading>Cancelling after we've started preparing</SubHeading>
            <p>
              Once preparation has started, ingredients have already been
              used, so the order may no longer be eligible for a refund.
            </p>

            <SubHeading>Cash on Delivery (COD)</SubHeading>
            <p>
              Refused or unclaimed COD deliveries may be subject to a
              cancellation charge at {brand.shortName}'s discretion.
            </p>

            <SubHeading>How refunds are returned</SubHeading>
            <p>
              Approved refunds are returned through the same payment method
              you used (GCash, Maya, or Bank Transfer) within a reasonable
              time.
            </p>
          </LegalSection>

          <p className="rounded-lg border border-[#E8E1DE] bg-[#FFFDFC] p-5 text-sm leading-6 text-[#5F5B58]">
            This page explains how {brand.shortName} handles your information
            and orders in plain language. It isn't a substitute for formal
            legal advice — if you need it reviewed for compliance with a
            specific law or regulation, please consult a licensed lawyer.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default Legal;
