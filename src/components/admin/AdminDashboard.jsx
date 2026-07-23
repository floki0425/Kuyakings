import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import AdminSidebar from "./AdminSidebar";
import { brand } from "../../lib/constants";
import OrderTable from "../order/OrderTable";
import SEO from "../seo/SEO";
import { getAdminSession, signOut } from "../../lib/auth";
import { formatPeso, getOrderProfit, isConfirmedSale } from "../../lib/sales";

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12a8 8 0 0 1 13.7-5.7L20 8.5" />
      <path d="M20 4v4.5h-4.5" />
      <path d="M20 12a8 8 0 0 1-13.7 5.7L4 15.5" />
      <path d="M4 20v-4.5h4.5" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4v11.5" />
      <path d="m7.5 11 4.5 4.5 4.5-4.5" />
      <path d="M5 19.5h14" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4h8l3 3v13H7Z" />
      <path d="M10 10h5M10 13.5h5M10 17h3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="m8.5 12.2 2.4 2.4 4.6-4.6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.5l3 2" />
    </svg>
  );
}

function CoinsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <ellipse cx="12" cy="6.5" rx="6.5" ry="2.8" />
      <path d="M5.5 6.5V12c0 1.5 2.9 2.8 6.5 2.8s6.5-1.3 6.5-2.8V6.5" />
      <path d="M5.5 12v5.5c0 1.5 2.9 2.8 6.5 2.8s6.5-1.3 6.5-2.8V12" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m4 8 8-4 8 4-8 4-8-4Z" />
      <path d="M4 8v8l8 4 8-4V8" />
      <path d="M12 12v8" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m4 16 5.5-5.5 4 4L20 7.5" />
      <path d="M15 7.5h5V12.5" />
    </svg>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [orderFilter, setOrderFilter] = useState("All");
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const [flavors, setFlavors] = useState([]);
  const [loadingFlavors, setLoadingFlavors] = useState(true);
  const [updatingFlavorId, setUpdatingFlavorId] = useState(null);
  const [priceDrafts, setPriceDrafts] = useState({});
  const [savingPriceId, setSavingPriceId] = useState(null);
  const [descriptionDrafts, setDescriptionDrafts] = useState({});
  const [savingDescriptionId, setSavingDescriptionId] = useState(null);

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

  async function handleUpdateOrderStatus(order, fields) {
    try {
      setUpdatingOrderId(order.id);

      const { data, error } = await supabase
        .from("orders")
        .update(fields)
        .eq("id", order.id)
        .select()
        .single();

      if (error) {
        alert(`Update failed: ${error.message}`);
        return;
      }

      setOrders((prev) =>
        prev.map((item) => (item.id === order.id ? data : item))
      );
    } catch (err) {
      alert(`Something went wrong: ${err.message}`);
    } finally {
      setUpdatingOrderId(null);
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
      .select("id, name, is_available, sort_order, price, description")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Fetch flavors error:", error);
      alert(`Failed to fetch products: ${error.message}`);
      setLoadingFlavors(false);
      return;
    }

    setFlavors(data || []);
    setPriceDrafts(
      Object.fromEntries((data || []).map((item) => [item.id, item.price]))
    );
    setDescriptionDrafts(
      Object.fromEntries(
        (data || []).map((item) => [item.id, item.description || ""])
      )
    );
    setLoadingFlavors(false);
  }

  async function handleSavePrice(flavorItem) {
    const nextPrice = Number(priceDrafts[flavorItem.id]);

    if (!Number.isFinite(nextPrice) || nextPrice <= 0) {
      alert("Enter a valid price greater than 0.");
      return;
    }

    try {
      setSavingPriceId(flavorItem.id);

      const { error } = await supabase
        .from("product_flavors")
        .update({ price: nextPrice })
        .eq("id", flavorItem.id);

      if (error) {
        alert(`Update failed: ${error.message}`);
        return;
      }

      setFlavors((prev) =>
        prev.map((item) =>
          item.id === flavorItem.id ? { ...item, price: nextPrice } : item
        )
      );
    } catch (err) {
      alert(`Something went wrong: ${err.message}`);
    } finally {
      setSavingPriceId(null);
    }
  }

  async function handleSaveDescription(flavorItem) {
    const nextDescription = (descriptionDrafts[flavorItem.id] || "").trim();

    try {
      setSavingDescriptionId(flavorItem.id);

      const { error } = await supabase
        .from("product_flavors")
        .update({ description: nextDescription })
        .eq("id", flavorItem.id);

      if (error) {
        alert(`Update failed: ${error.message}`);
        return;
      }

      setFlavors((prev) =>
        prev.map((item) =>
          item.id === flavorItem.id
            ? { ...item, description: nextDescription }
            : item
        )
      );
    } catch (err) {
      alert(`Something went wrong: ${err.message}`);
    } finally {
      setSavingDescriptionId(null);
    }
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
      const { session, isAdmin, error } = await getAdminSession({ refresh: true });

      if (!session || error || !isAdmin) {
        await signOut();
        navigate("/admin/login", {
          replace: true,
          state: {
            message: session
              ? "Your account does not have the Kuya King's admin role."
              : "Please sign in with the Kuya King's admin account.",
          },
        });
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

  // Confirmed sales also include delivered COD orders, matching the
  // per-order profit shown in the order table/details page -- filtering by
  // payment_status === "Paid" alone under-counted delivered COD sales here.
  const confirmedSales = orders.filter(isConfirmedSale);

  const totalSales = confirmedSales.reduce(
    (sum, order) => sum + Number(order.subtotal || 0),
    0
  );

  const totalPacksSold = confirmedSales.reduce(
    (sum, order) => sum + Number(order.quantity || 0),
    0
  );

  const totalProfit = confirmedSales.reduce(
    (sum, order) => sum + getOrderProfit(order),
    0
  );

  const cards = [
    { label: "Total Orders", value: totalOrders.toLocaleString("en-PH"), icon: <OrdersIcon /> },
    { label: "Paid Orders", value: paidOrders.length.toLocaleString("en-PH"), icon: <CheckIcon /> },
    { label: "Pending Orders", value: pendingOrders.length.toLocaleString("en-PH"), icon: <ClockIcon /> },
    { label: "Total Sales", value: formatPeso(totalSales), icon: <CoinsIcon /> },
    { label: "Items Sold", value: totalPacksSold.toLocaleString("en-PH"), icon: <BoxIcon /> },
    {
      label: `Total Profit (${brand.profitRate * 100}%)`,
      value: formatPeso(totalProfit),
      icon: <TrendIcon />,
      emphasis: true,
    },
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
      "Product",
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
    link.download = `kuya-kings-orders-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#FFF7F2] px-4 py-5 text-[#171717] sm:px-5">
      <SEO
        title="Admin Dashboard"
        description="Kuya King's order management dashboard."
        path="/admin/dashboard"
        noIndex
      />
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6">
        <div className="lg:sticky lg:top-5 lg:self-start">
          <AdminSidebar />
        </div>

        <section className="min-w-0">
          <div className="kk-fade-in flex flex-col gap-4 rounded-lg border border-[#E8E1DE] bg-white p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-widest text-[#C91F3A] sm:text-sm">
                Admin Panel
              </p>

              <h1 className="mt-2 font-serif text-2xl font-bold leading-tight text-[#17191C] sm:text-3xl">
                Admin Dashboard
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#5F5B58]">
                Monitor orders, sales, items sold, and profit.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={fetchOrders}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#c91f3a] px-5 py-3 text-sm font-black text-white transition hover:opacity-90 sm:w-auto [&_svg]:h-4 [&_svg]:w-4 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.8]"
              >
                <RefreshIcon />
                Refresh Orders
              </button>

              <button
                type="button"
                onClick={exportCSV}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-[#17191C] px-5 py-3 text-sm font-black text-[#17191C] transition hover:bg-[#17191C] hover:text-white sm:w-auto [&_svg]:h-4 [&_svg]:w-4 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.8]"
              >
                <DownloadIcon />
                Export CSV
              </button>
            </div>
          </div>

          <div
            className="kk-fade-in mt-5 rounded-lg border border-[#E8E1DE] bg-white p-5 sm:p-6"
            style={{ animationDelay: "80ms" }}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[#C91F3A] sm:text-sm">
                  Product Availability
                </p>
                <h2 className="mt-2 font-serif text-xl font-bold text-[#17191C]">
                  Manage Sold Out Products
                </h2>
                <p className="mt-1 text-sm text-[#5F5B58]">
                  Mark products as sold out or available, and update pricing.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchFlavors}
                className="flex items-center gap-2 rounded-full border border-[#17191C] px-5 py-3 text-sm font-black text-[#17191C] transition hover:bg-[#17191C] hover:text-white [&_svg]:h-4 [&_svg]:w-4 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.8]"
              >
                <RefreshIcon />
                Refresh Products
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {loadingFlavors ? (
                <p className="text-sm font-bold text-[#5F5B58]">
                  Loading products...
                </p>
              ) : flavors.length === 0 ? (
                <p className="text-sm font-bold text-[#5F5B58]">
                  No products found.
                </p>
              ) : (
                flavors.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[0.85rem] border border-[#E8E1DE] bg-[#FFF7F2] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-black text-[#17191C]">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs font-bold text-[#8a8580]">
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

                    <div className="mt-4 flex items-center gap-2">
                      <label className="sr-only" htmlFor={`price-${item.id}`}>
                        Price for {item.name}
                      </label>
                      <span className="text-sm font-black text-[#8a8580]">₱</span>
                      <input
                        id={`price-${item.id}`}
                        type="number"
                        min="0"
                        step="1"
                        value={priceDrafts[item.id] ?? item.price}
                        onChange={(e) =>
                          setPriceDrafts((prev) => ({
                            ...prev,
                            [item.id]: e.target.value,
                          }))
                        }
                        className="kk-input px-3 py-2 text-sm font-bold text-[#17191C]"
                      />
                      <button
                        type="button"
                        onClick={() => handleSavePrice(item)}
                        disabled={
                          savingPriceId === item.id ||
                          Number(priceDrafts[item.id]) === Number(item.price)
                        }
                        className="rounded-[0.6rem] bg-[#17191C] px-3 py-2 text-xs font-black text-white transition hover:opacity-90 disabled:opacity-40"
                      >
                        {savingPriceId === item.id ? "Saving..." : "Save"}
                      </button>
                    </div>

                    <div className="mt-3">
                      <label
                        className="text-xs font-black uppercase tracking-wide text-[#8a8580]"
                        htmlFor={`description-${item.id}`}
                      >
                        Description
                      </label>
                      <textarea
                        id={`description-${item.id}`}
                        rows={3}
                        value={descriptionDrafts[item.id] ?? item.description ?? ""}
                        onChange={(e) =>
                          setDescriptionDrafts((prev) => ({
                            ...prev,
                            [item.id]: e.target.value,
                          }))
                        }
                        placeholder="Short description shown on the Menu page"
                        className="kk-input mt-1.5 resize-none text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveDescription(item)}
                        disabled={
                          savingDescriptionId === item.id ||
                          (descriptionDrafts[item.id] ?? "") ===
                            (item.description ?? "")
                        }
                        className="mt-2 w-full rounded-[0.6rem] bg-[#17191C] px-3 py-2 text-xs font-black text-white transition hover:opacity-90 disabled:opacity-40"
                      >
                        {savingDescriptionId === item.id
                          ? "Saving..."
                          : "Save Description"}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFlavorAvailability(item)}
                      disabled={updatingFlavorId === item.id}
                      className={`mt-3 w-full rounded-full px-4 py-2 text-sm font-black text-white transition hover:opacity-90 disabled:opacity-60 ${
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
            {cards.map((card, index) => (
              <div
                key={card.label}
                className={`kk-fade-in min-w-0 rounded-lg border p-5 ${
                  card.emphasis
                    ? "border-[#c91f3a] bg-[#c91f3a]"
                    : "border-[#E8E1DE] bg-white"
                }`}
                style={{ animationDelay: `${120 + index * 60}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full [&_svg]:h-4 [&_svg]:w-4 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.6] ${
                      card.emphasis
                        ? "bg-white/15 text-white"
                        : "bg-[#F8E6E4] text-[#c91f3a]"
                    }`}
                  >
                    {card.icon}
                  </span>
                  <p
                    className={`text-sm font-bold ${
                      card.emphasis ? "text-white/80" : "text-[#8a8580]"
                    }`}
                  >
                    {card.label}
                  </p>
                </div>
                <p
                  className={`mt-4 break-words text-2xl font-black sm:text-3xl ${
                    card.emphasis ? "text-white" : "text-[#17191C]"
                  }`}
                >
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search order/customer/phone..."
              className="kk-input sm:col-span-2"
            />

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="kk-input"
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
              className="kk-input"
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
              <div className="rounded-lg border border-[#E8E1DE] bg-white p-8 text-center">
                <p className="font-black text-[#17191C]">Loading orders...</p>
              </div>
            ) : (
              <OrderTable
                orders={filteredOrders}
                onDeleteOrder={handleDeleteOrder}
                deletingOrderId={deletingOrderId}
                onUpdateStatus={handleUpdateOrderStatus}
                updatingOrderId={updatingOrderId}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;
