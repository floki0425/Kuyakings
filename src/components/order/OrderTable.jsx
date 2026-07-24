import { Link } from "react-router-dom";
import { brand } from "../../lib/constants";
import { formatPeso, getOrderProfit } from "../../lib/sales";
import StatusSelect from "../ui/StatusSelect";

const PAYMENT_STATUS_OPTIONS = ["Pending", "Paid", "COD", "Cancelled"];

const ORDER_STATUS_OPTIONS = [
  "New Order",
  "Confirmed",
  "Preparing",
  "Shipped / Out for Delivery",
  "Delivered",
  "Cancelled",
];

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function OrderTable({
  orders,
  onDeleteOrder,
  deletingOrderId,
  onUpdateStatus,
  updatingOrderId,
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#E8E1DE] bg-white">
      <div className="border-b border-[#E8E1DE] p-6">
        <h2 className="font-serif text-2xl font-bold text-[#17191C]">Orders</h2>
        <p className="mt-1 text-sm text-[#5F5B58]">
          Track orders, payment status, delivery status, and profit.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="p-8 text-center text-sm text-[#5F5B58]">
          No orders yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead className="bg-[#FFF7F2] text-[#17191C]">
              <tr>
                <th className="px-5 py-4">Order</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Subtotal</th>
                <th className="px-5 py-4">
                  Profit ({brand.profitRate * 100}%)
                </th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-[#E8E1DE] transition hover:bg-[#FFF7F2]"
                >
                  <td className="px-5 py-4">
                    <p className="font-black text-[#17191C]">
                      {order.order_number}
                    </p>
                    <p className="mt-0.5 text-xs text-[#8a8580]">
                      {formatDate(order.created_at)}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-bold text-[#17191C]">
                      {order.customer_name}
                    </p>
                    <p className="mt-0.5 text-xs text-[#8a8580]">{order.phone}</p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-[#17191C]">{order.flavor}</p>
                    <p className="mt-0.5 text-xs text-[#8a8580]">
                      Qty {order.quantity}
                    </p>
                  </td>

                  <td className="px-5 py-4 font-black text-[#17191C]">
                    {formatPeso(order.subtotal)}
                  </td>

                  <td className="px-5 py-4 font-black text-[#c91f3a]">
                    {formatPeso(getOrderProfit(order))}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex w-36 flex-col gap-2">
                      <StatusSelect
                        value={order.payment_status}
                        options={PAYMENT_STATUS_OPTIONS}
                        disabled={updatingOrderId === order.id}
                        onChange={(value) =>
                          onUpdateStatus(order, { payment_status: value })
                        }
                      />
                      <StatusSelect
                        value={order.order_status}
                        options={ORDER_STATUS_OPTIONS}
                        disabled={updatingOrderId === order.id}
                        onChange={(value) =>
                          onUpdateStatus(order, { order_status: value })
                        }
                      />
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="rounded-xl bg-[#17191C] px-4 py-2 text-xs font-black text-white transition hover:opacity-90"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => onDeleteOrder(order)}
                        disabled={deletingOrderId === order.id}
                        className="rounded-xl bg-red-600 px-4 py-2 text-xs font-black text-white transition hover:opacity-90 disabled:opacity-60"
                      >
                        {deletingOrderId === order.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
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
