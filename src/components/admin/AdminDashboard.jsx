import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import AdminSidebar from "./AdminSidebar";
import { brand } from "../../lib/constants";
import OrderTable from "../order/OrderTable";


function AdminDashboard() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("Fetched orders:", data);
    console.log("Fetch error:", error);

    if (error) {
      console.error("Fetch orders error:", error);
      alert(`Failed to fetch orders: ${error.message}`);
      setLoading(false);
      return;
    }

    setOrders(data || []);
    setLoading(false);
  }

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");

    if (!isLoggedIn) {
      navigate("/admin/login");
      return;
    }

    fetchOrders();
  }, [navigate]);

  const totalOrders = orders.length;

  const paidOrders = orders.filter(
    (order) => order.payment_status === "Paid"
  );

  const pendingOrders = orders.filter(
    (order) => order.payment_status === "Pending"
  );

  const totalSales = paidOrders.reduce(
    (sum, order) => sum + Number(order.subtotal || 0),
    0
  );

  const totalPacksSold = paidOrders.reduce(
    (sum, order) => sum + Number(order.quantity || 0),
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

            <button
              onClick={fetchOrders}
              className="rounded-full bg-[#D96C2C] px-5 py-3 text-sm font-black text-white"
            >
              Refresh Orders
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

          <div className="mt-6">
            {loading ? (
              <div className="rounded-[2rem] border border-[#D8D0C3] bg-white p-8 text-center shadow-sm">
                <p className="font-black text-[#25382B]">Loading orders...</p>
              </div>
            ) : (
              <OrderTable orders={orders} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;