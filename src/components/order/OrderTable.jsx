import { Link } from "react-router-dom";
import { brand } from "../../lib/constants";

function OrderTable({ orders }) {
  function getCommission(order) {
    if (order.payment_status === "Paid" && order.order_status !== "Cancelled") {
      return Number(order.subtotal || 0) * brand.commissionRate;
    }

    if (order.payment_status === "COD" && order.order_status === "Delivered") {
      return Number(order.subtotal || 0) * brand.commissionRate;
    }

    return 0;
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-[#D8D0C3] bg-white shadow-sm">
      <div className="border-b border-[#D8D0C3] p-6">
        <h2 className="text-2xl font-black text-[#25382B]">Orders</h2>
        <p className="mt-1 text-sm text-[#555]">
          Track orders, payment status, delivery status, and commission.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="p-8 text-center text-sm text-[#555]">
          No orders yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
            <thead className="bg-[#F8F1E7] text-[#25382B]">
              <tr>
                <th className="px-5 py-4">Order No.</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">Flavor</th>
                <th className="px-5 py-4">Qty</th>
                <th className="px-5 py-4">Subtotal</th>
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4">Order Status</th>
                <th className="px-5 py-4">Commission</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-[#D8D0C3]">
                  <td className="px-5 py-4 font-black text-[#25382B]">
                    {order.order_number}
                  </td>
                  <td className="px-5 py-4">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">{order.customer_name}</td>
                  <td className="px-5 py-4">{order.phone}</td>
                  <td className="px-5 py-4">{order.flavor}</td>
                  <td className="px-5 py-4">{order.quantity}</td>
                  <td className="px-5 py-4 font-bold">₱{order.subtotal}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-[#DDE8D2] px-3 py-1 text-xs font-black text-[#25382B]">
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="px-5 py-4">{order.order_status}</td>
                  <td className="px-5 py-4 font-black text-[#D96C2C]">
                    ₱{getCommission(order)}
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="rounded-full bg-[#25382B] px-4 py-2 text-xs font-black text-white"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OrderTable;