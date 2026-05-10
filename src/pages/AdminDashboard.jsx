import AdminSidebar from "../components/admin/AdminSidebar";
import OrderTable from "../components/admin/OrderTable";
import { mockOrders } from "../lib/mockOrders";
import { brand } from "../lib/constants";

function AdminDashboard() {
  const totalOrders = mockOrders.length;

  const paidOrders = mockOrders.filter(
    (order) => order.paymentStatus === "Paid"
  );

  const pendingOrders = mockOrders.filter(
    (order) => order.paymentStatus === "Pending"
  );

  const totalSales = paidOrders.reduce((sum, order) => sum + order.subtotal, 0);

  const totalPacksSold = paidOrders.reduce(
    (sum, order) => sum + order.quantity,
    0
  );

  const totalCommission = totalSales * brand.commissionRate;

  const cards = [
    ["Total Orders", totalOrders],
    ["Paid Orders", paidOrders.length],
    ["Pending Orders", pendingOrders.length],
    ["Total Sales", `₱${totalSales}`],
    ["Packs Sold", totalPacksSold],
    ["Total Commission", `₱${totalCommission}`],
  ];

  return (
    <main className="min-h-screen bg-[#F8F1E7] p-5 text-[#2B2B2B]">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <AdminSidebar />

        <section>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-black text-[#25382B]">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-[#555]">
                Monitor orders, sales, packs sold, and commission.
              </p>
            </div>

            <button className="rounded-full bg-[#D96C2C] px-5 py-3 text-sm font-black text-white">
              Export CSV
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map(([label, value]) => (
              <div
                key={label}
                className="rounded-[1.5rem] border border-[#D8D0C3] bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-bold text-[#555]">{label}</p>
                <p className="mt-3 text-3xl font-black text-[#25382B]">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <input
              placeholder="Search order/customer..."
              className="rounded-2xl border border-[#D8D0C3] bg-white px-4 py-3 outline-none md:col-span-2"
            />

            <select className="rounded-2xl border border-[#D8D0C3] bg-white px-4 py-3 outline-none">
              <option>All Payment Status</option>
              <option>Pending</option>
              <option>Paid</option>
              <option>COD</option>
            </select>

            <select className="rounded-2xl border border-[#D8D0C3] bg-white px-4 py-3 outline-none">
              <option>All Order Status</option>
              <option>New Order</option>
              <option>Confirmed</option>
              <option>Preparing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
          </div>

          <div className="mt-6">
            <OrderTable orders={mockOrders} />
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;