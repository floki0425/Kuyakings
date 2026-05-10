import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

function ThankYou() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem("latestOrder");

    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#F8F1E7] text-[#2B2B2B]">
      <Header />

      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="rounded-[2rem] border border-[#D8D0C3] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#DDE8D2] text-4xl">
            ✓
          </div>

          <h1 className="mt-6 text-4xl font-black text-[#25382B]">
            Thank you! Your order has been submitted.
          </h1>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#555]">
            We received your order details. The owner will review your payment and
            delivery details before confirming your order.
          </p>

          <div className="mt-6 inline-flex rounded-full bg-[#F8F1E7] px-5 py-2 text-sm font-black text-[#25382B]">
            Order Status: Pending Confirmation
          </div>
        </div>

        {order && (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-[#D8D0C3] bg-white p-6 shadow-sm">
              <p className="text-sm font-black uppercase tracking-widest text-[#D96C2C]">
                Order Summary
              </p>

              <h2 className="mt-3 text-2xl font-black text-[#25382B]">
                {order.orderId}
              </h2>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#555]">Product</span>
                  <span className="font-bold text-[#25382B]">{order.product}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#555]">Flavor</span>
                  <span className="font-bold text-[#25382B]">{order.flavor}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#555]">Quantity</span>
                  <span className="font-bold text-[#25382B]">
                    {order.quantity} pack(s)
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#555]">Payment Method</span>
                  <span className="font-bold text-[#25382B]">
                    {order.paymentMethod}
                  </span>
                </div>

                <div className="border-t border-[#D8D0C3] pt-4">
                  <div className="flex justify-between">
                    <span className="font-black text-[#25382B]">Subtotal</span>
                    <span className="text-2xl font-black text-[#D96C2C]">
                      ₱{order.subtotal}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#D8D0C3] bg-white p-6 shadow-sm">
              <p className="text-sm font-black uppercase tracking-widest text-[#D96C2C]">
                What Happens Next?
              </p>

              <div className="mt-6 space-y-4 text-sm leading-6 text-[#555]">
                <p>1. Owner will review your order.</p>
                <p>2. Payment/proof of payment will be checked.</p>
                <p>3. Delivery fee and schedule will be confirmed.</p>
                <p>4. Once confirmed, your order will be prepared.</p>
                <p>5. You will receive updates through Messenger, SMS, or call.</p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link
                  to="/order"
                  className="rounded-full bg-[#D96C2C] px-5 py-3 text-center font-black text-white"
                >
                  Order Again
                </Link>

                <Link
                  to="/"
                  className="rounded-full border border-[#25382B] px-5 py-3 text-center font-black text-[#25382B]"
                >
                  Back Home
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

export default ThankYou;