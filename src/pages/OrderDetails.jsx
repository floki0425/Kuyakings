import { Link, useParams } from "react-router-dom";
import { mockOrders } from "../lib/mockOrders";
import { brand } from "../lib/constants";

function OrderDetails() {
  const { id } = useParams();

  const order = mockOrders.find((item) => item.id === id);

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F1E7] p-5">
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-black text-[#25382B]">
            Order not found
          </h1>

          <Link
            to="/admin/dashboard"
            className="mt-6 inline-flex rounded-full bg-[#D96C2C] px-6 py-3 font-black text-white"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const commission =
    order.paymentStatus === "Paid" && order.orderStatus !== "Cancelled"
      ? order.subtotal * brand.commissionRate
      : 0;

  return (
    <main className="min-h-screen bg-[#F8F1E7] p-5 text-[#2B2B2B]">
      <section className="mx-auto max-w-5xl">
        <Link
          to="/admin/dashboard"
          className="inline-flex rounded-full border border-[#25382B] px-5 py-2 text-sm font-black text-[#25382B]"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-6 rounded-[2rem] border border-[#D8D0C3] bg-white p-6 shadow-sm">
          <p className="text-sm font-black uppercase tracking-widest text-[#D96C2C]">
            Order Details
          </p>

          <h1 className="mt-3 text-3xl font-black text-[#25382B]">
            {order.id}
          </h1>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl bg-[#F8F1E7] p-5">
              <h2 className="font-black text-[#25382B]">Customer Information</h2>
              <p className="mt-4 text-sm">Name: {order.customerName}</p>
              <p className="text-sm">Phone: {order.phone}</p>
            </div>

            <div className="rounded-2xl bg-[#F8F1E7] p-5">
              <h2 className="font-black text-[#25382B]">Product Details</h2>
              <p className="mt-4 text-sm">Product: {brand.name}</p>
              <p className="text-sm">Flavor: {order.flavor}</p>
              <p className="text-sm">Quantity: {order.quantity} pack(s)</p>
              <p className="text-sm">Subtotal: ₱{order.subtotal}</p>
            </div>

            <div className="rounded-2xl bg-[#F8F1E7] p-5">
              <h2 className="font-black text-[#25382B]">Payment Details</h2>
              <p className="mt-4 text-sm">Method: {order.paymentMethod}</p>
              <p className="text-sm">Status: {order.paymentStatus}</p>
            </div>

            <div className="rounded-2xl bg-[#F8F1E7] p-5">
              <h2 className="font-black text-[#25382B]">Commission Details</h2>
              <p className="mt-4 text-sm">Rate: 15%</p>
              <p className="text-sm">Commission: ₱{commission}</p>
              <p className="text-sm">
                Status: {commission > 0 ? "Counted" : "Pending"}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <button className="rounded-full bg-[#25382B] px-4 py-3 text-sm font-black text-white">
              Mark as Paid
            </button>
            <button className="rounded-full bg-[#25382B] px-4 py-3 text-sm font-black text-white">
              Mark as Preparing
            </button>
            <button className="rounded-full bg-[#25382B] px-4 py-3 text-sm font-black text-white">
              Mark as Delivered
            </button>
            <button className="rounded-full bg-red-600 px-4 py-3 text-sm font-black text-white">
              Cancel Order
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default OrderDetails;