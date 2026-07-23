import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SEO from "../components/seo/SEO";
import Reveal from "../components/common/Reveal";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 fill-none stroke-current stroke-[2.4]">
      <path d="m5 12.5 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-[1.8]">
      <rect x="8.5" y="8.5" width="11" height="11" rx="1.6" />
      <path d="M5.5 15.5v-9a1.6 1.6 0 0 1 1.6-1.6h9" />
    </svg>
  );
}

const nextSteps = [
  "Owner will review your order.",
  "Payment / proof of payment will be checked.",
  "Delivery fee and schedule will be confirmed.",
  "Once confirmed, your order will be prepared.",
  "Track your order anytime using your order number and phone number.",
];

function ThankYou() {
  const [order] = useState(() => {
    const savedOrder = localStorage.getItem("latestOrder");

    return savedOrder ? JSON.parse(savedOrder) : null;
  });
  const [copied, setCopied] = useState(false);

  function copyOrderNumber() {
    if (!order?.order_number) return;

    navigator.clipboard.writeText(order.order_number);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  return (
    <main className="min-h-screen bg-[#FFF7F2] text-[#171717]">
      <SEO
        title="Order Submitted"
        description="Your Kuya King's Beef Tapa order has been submitted."
        path="/thank-you"
        noIndex
      />
      <Header />

      <section className="mx-auto max-w-4xl px-5 py-14 min-[421px]:py-20">
        <div className="kk-fade-in rounded-lg border border-[#E8E1DE] bg-white p-8 text-center min-[421px]:p-12">
          <div className="kk-pop-in mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#c91f3a] text-white">
            <CheckIcon />
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-widest text-[#C91F3A]">
            Order Submitted
          </p>

          <h1 className="mt-3 font-serif text-3xl font-bold leading-[1.1] text-[#17191C] min-[421px]:text-4xl">
            Thank you! We&apos;ve got your order.
          </h1>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-[#5F5B58]">
            We received your order details. The owner will review your
            payment and delivery details before confirming your order.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#E8E1DE] bg-[#FFF7F2] px-5 py-2 text-sm font-black text-[#17191C]">
            <span className="h-2 w-2 rounded-full bg-[#c91f3a]" />
            Order Status: Pending Confirmation
          </div>

          {order?.order_number && (
            <div className="mx-auto mt-8 max-w-lg rounded-[0.85rem] border border-[#E8E1DE] bg-[#FFF7F2] p-6">
              <p className="text-sm font-bold text-[#5F5B58]">
                Your Tracking / Order Number
              </p>

              <p className="mt-2 break-words font-serif text-3xl font-bold text-[#17191C]">
                {order.order_number}
              </p>

              <p className="mt-3 text-sm leading-6 text-[#5F5B58]">
                Save this order number. You will need it together with your
                phone number to track your order status.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={copyOrderNumber}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#17191C] px-6 py-3 text-sm font-black text-[#17191C] transition hover:bg-[#17191C] hover:text-white"
                >
                  <CopyIcon />
                  {copied ? "Copied!" : "Copy Order Number"}
                </button>

                <Link
                  to="/track-order"
                  className="rounded-full bg-[#c91f3a] px-6 py-3 text-center text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#a61930]"
                >
                  Track My Order
                </Link>
              </div>
            </div>
          )}
        </div>

        {order && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Reveal className="rounded-lg border border-[#E8E1DE] bg-white p-6 min-[421px]:p-7">
              <p className="text-xs font-black uppercase tracking-widest text-[#C91F3A]">
                Order Summary
              </p>
              <h2 className="mt-2 font-serif text-xl font-bold text-[#17191C]">
                What You Ordered
              </h2>

              <div className="mt-5 divide-y divide-[#E8E1DE] border-y border-[#E8E1DE] text-sm">
                <div className="flex justify-between gap-4 py-3">
                  <span className="text-[#8a8580]">Product</span>
                  <span className="text-right font-bold text-[#17191C]">
                    {order.product_name || "Kuya King's Beef Tapa"}
                  </span>
                </div>

                <div className="flex justify-between gap-4 py-3">
                  <span className="text-[#8a8580]">Product Option</span>
                  <span className="font-bold text-[#17191C]">
                    {order.flavor || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between gap-4 py-3">
                  <span className="text-[#8a8580]">Quantity</span>
                  <span className="font-bold text-[#17191C]">
                    {order.quantity || 0}{" "}
                    {order.flavor?.toLowerCase().startsWith("bundle") ? "bundle(s)" : "jar(s)"}
                  </span>
                </div>

                <div className="flex justify-between gap-4 py-3">
                  <span className="text-[#8a8580]">Payment Method</span>
                  <span className="font-bold text-[#17191C]">
                    {order.payment_method || "N/A"}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-[0.85rem] bg-[#FFF7F2] p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-black text-[#17191C]">Subtotal</span>
                  <span className="text-2xl font-black text-[#c91f3a]">
                    ₱{Number(order.subtotal || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120} className="rounded-lg border border-[#E8E1DE] bg-white p-6 min-[421px]:p-7">
              <p className="text-xs font-black uppercase tracking-widest text-[#C91F3A]">
                Next Steps
              </p>
              <h2 className="mt-2 font-serif text-xl font-bold text-[#17191C]">
                What Happens Next?
              </h2>

              <ol className="mt-5 space-y-4">
                {nextSteps.map((step, index) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-[#c91f3a]/35 text-xs font-black text-[#c91f3a]">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-6 text-[#5F5B58]">{step}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Link
                  to="/order"
                  className="rounded-full bg-[#c91f3a] px-3 py-3 text-center text-sm font-black text-white transition hover:opacity-90"
                >
                  Order Again
                </Link>

                <Link
                  to="/track-order"
                  className="rounded-full border border-[#c91f3a] px-3 py-3 text-center text-sm font-black text-[#c91f3a] transition hover:bg-[#F8E6E4]"
                >
                  Track Order
                </Link>

                <Link
                  to="/"
                  className="rounded-full border border-[#17191C] px-3 py-3 text-center text-sm font-black text-[#17191C] transition hover:bg-[#17191C] hover:text-white"
                >
                  Back Home
                </Link>
              </div>
            </Reveal>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

export default ThankYou;
