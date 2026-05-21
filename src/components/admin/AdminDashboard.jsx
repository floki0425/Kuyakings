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
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [orderFilter, setOrderFilter] = useState("All");
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  const [flavors, setFlavors] = useState([]);
  const [loadingFlavors, setLoadingFlavors] = useState(true);
  const [updatingFlavorId, setUpdatingFlavorId] = useState(null);

  async function handleDeleteOrder(order) {
    const confirmed = window.confirm(
      `Delete order ${order.order_number}? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingOrderId(order.id);

      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", order.id);

      if (error) {
        alert(`Delete failed: ${error.message}`);
        return;
      }

      setOrders((prev) => prev.filter((item) => item.id !== order.id));
    } catch (err) {
      alert(`Something went wrong: ${err.message}`);
    } finally {
      setDeletingOrderId(null);
    }
  }

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

  async function fetchFlavors() {
    setLoadingFlavors(true);

    const { data, error } = await supabase
      .from("product_flavors")
      .select("id, name, is_available, sort_order")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Fetch flavors error:", error);
      alert(`Failed to fetch flavors: ${error.message}`);
      setLoadingFlavors(false);
      return;
    }

    setFlavors(data || []);
    setLoadingFlavors(false);
  }

  async function toggleFlavorAvailability(flavorItem) {
    const nextStatus = !flavorItem.is_available;

    const confirmed = window.confirm(
      `${nextStatus ? "Mark as available" : "Mark as sold out"}: ${
        flavorItem.name
      }?`
    );

    if (!confirmed) return;

    try {
      setUpdatingFlavorId(flavorItem.id);

      const { error } = await supabase
        .from("product_flavors")
        .update({ is_available: nextStatus })
        .eq("id", flavorItem.id);

      if (error) {
        alert(`Update failed: ${error.message}`);
        return;
      }

      setFlavors((prev) =>
        prev.map((item) =>
          item.id === flavorItem.id
            ? { ...item, is_available: nextStatus }
            : item
        )
      );
    } catch (err) {
      alert(`Something went wrong: ${err.message}`);
    } finally {
      setUpdatingFlavorId(null);
    }
  }

  useEffect(() => {
    async function checkSessionAndFetchOrders() {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        navigate("/admin/login");
        return;
      }

      fetchOrders();
      fetchFlavors();
    }

    checkSessionAndFetchOrders();
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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPayment =
      paymentFilter === "All" || order.payment_status === paymentFilter;

    const matchesOrder =
      orderFilter === "All" || order.order_status === orderFilter;

    return matchesSearch && matchesPayment && matchesOrder;
  });

  function exportCSV() {
    function escapeCSV(value) {
      return `"${String(value ?? "").replaceAll('"', '""')}"`;
    }

    function formatDate(dateValue) {
      if (!dateValue) return "";

      return new Date(dateValue).toLocaleString("en-PH", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    const headers = [
      "Order Number",
      "Customer Name",
      "Phone Number",
      "Flavor",
      "Quantity",
      "Subtotal",
      "Payment Method",
      "Payment Status",
      "Order Status",
      "Created At",
    ];

    const rows = filteredOrders.map((order) => [
      order.order_number,
      order.customer_name,
      order.phone,
      order.flavor,
      order.quantity,
      `PHP ${order.subtotal}`,
      order.payment_method,
      order.payment_status,
      order.order_status,
      formatDate(order.created_at),
    ]);

    const csvRows = [
      "sep=,",
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ];

    const csvContent = csvRows.join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `pure-grind-orders-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#F8F1E7] px-4 py-5 text-[#2B2B2B] sm:px-5">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6">
        <div className="lg:sticky lg:top-5 lg:self-start">
          <AdminSidebar />
        </div>

        <section className="min-w-0">
          <div className="flex flex-col gap-4 rounded-[2rem] border border-[#D8D0C3] bg-white p-5 shadow-sm sm:p-6 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-widest text-[#D96C2C] sm:text-sm">
                Admin Panel
              </p>

              <h1 className="mt-2 text-2xl font-black leading-tight text-[#25382B] sm:text-3xl">
                Admin Dashboard
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#555]">
                Monitor orders, sales, packs sold, and commission.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={fetchOrders}
                className="w-full rounded-full bg-[#D96C2C] px-5 py-3 text-sm font-black text-white transition hover:opacity-90 sm:w-auto"
              >
                Refresh Orders
              </button>

              <button
                type="button"
                onClick={exportCSV}
                className="w-full rounded-full bg-[#25382B] px-5 py-3 text-sm font-black text-white transition hover:opacity-90 sm:w-auto"
              >
                Export CSV
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-[2rem] border border-[#D8D0C3] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[#D96C2C] sm:text-sm">
                  Flavor Availability
                </p>
                <h2 className="mt-2 text-xl font-black text-[#25382B]">
                  Manage Sold Out Flavors
                </h2>
                <p className="mt-1 text-sm text-[#555]">
                  Mark flavors as sold out or available.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchFlavors}
                className="rounded-full bg-[#25382B] px-5 py-3 text-sm font-black text-white transition hover:opacity-90"
              >
                Refresh Flavors
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {loadingFlavors ? (
                <p className="text-sm font-bold text-[#555]">
                  Loading flavors...
                </p>
              ) : flavors.length === 0 ? (
                <p className="text-sm font-bold text-[#555]">
                  No flavors found.
                </p>
              ) : (
                flavors.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-[#D8D0C3] bg-[#F8F1E7] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-black text-[#25382B]">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs font-bold text-[#555]">
                          {item.is_available ? "Available" : "Sold Out"}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          item.is_available
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.is_available ? "ON" : "OFF"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFlavorAvailability(item)}
                      disabled={updatingFlavorId === item.id}
                      className={`mt-4 w-full rounded-full px-4 py-2 text-sm font-black text-white transition hover:opacity-90 disabled:opacity-60 ${
                        item.is_available ? "bg-red-600" : "bg-green-700"
                      }`}
                    >
                      {updatingFlavorId === item.id
                        ? "Updating..."
                        : item.is_available
                          ? "Mark Sold Out"
                          : "Mark Available"}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map(([label, value]) => (
              <div
                key={label}
                className="min-w-0 rounded-[1.5rem] border border-[#D8D0C3] bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-bold text-[#555]">{label}</p>
                <p className="mt-3 break-words text-2xl font-black text-[#25382B] sm:text-3xl">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search order/customer/phone..."
              className="w-full rounded-2xl border border-[#D8D0C3] bg-white px-4 py-3 text-sm outline-none sm:col-span-2"
            />

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full rounded-2xl border border-[#D8D0C3] bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="All">All Payment Status</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="COD">COD</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              value={orderFilter}
              onChange={(e) => setOrderFilter(e.target.value)}
              className="w-full rounded-2xl border border-[#D8D0C3] bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="All">All Order Status</option>
              <option value="New Order">New Order</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Preparing">Preparing</option>
              <option value="Shipped / Out for Delivery">
                Shipped / Out for Delivery
              </option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="mt-5 min-w-0">
            {loading ? (
              <div className="rounded-[2rem] border border-[#D8D0C3] bg-white p-8 text-center shadow-sm">
                <p className="font-black text-[#25382B]">Loading orders...</p>
              </div>
            ) : (
              <OrderTable
                orders={filteredOrders}
                onDeleteOrder={handleDeleteOrder}
                deletingOrderId={deletingOrderId}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;
