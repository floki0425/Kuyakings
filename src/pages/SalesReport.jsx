import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import AdminSidebar from "../components/admin/AdminSidebar";
import SEO from "../components/seo/SEO";
import { getAdminSession, signOut } from "../lib/auth";
import { brand } from "../lib/constants";
import { formatPeso, getOrderProfit, isConfirmedSale } from "../lib/sales";

const RANGES = [
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "all", label: "All Time" },
];

function getRangeStart(range) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (range === "today") return startOfToday;

  if (range === "week") {
    const dayIndex = startOfToday.getDay();
    const daysSinceMonday = (dayIndex + 6) % 7;
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - daysSinceMonday);
    return startOfWeek;
  }

  if (range === "month") {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return null;
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

function SalesReport() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("month");

  async function fetchOrders() {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

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
    async function checkSessionAndFetch() {
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
    }

    checkSessionAndFetch();
  }, [navigate]);

  const rangeStart = getRangeStart(range);
  const scopedOrders = rangeStart
    ? orders.filter((order) => new Date(order.created_at) >= rangeStart)
    : orders;

  const confirmedSales = scopedOrders.filter(isConfirmedSale);

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
    {
      label: "Orders in Range",
      value: scopedOrders.length.toLocaleString("en-PH"),
      icon: <OrdersIcon />,
    },
    {
      label: "Confirmed Sales",
      value: confirmedSales.length.toLocaleString("en-PH"),
      icon: <CheckIcon />,
    },
    {
      label: "Total Sales",
      value: formatPeso(totalSales),
      icon: <CoinsIcon />,
    },
    {
      label: "Items Sold",
      value: totalPacksSold.toLocaleString("en-PH"),
      icon: <BoxIcon />,
    },
    {
      label: `Total Profit (${brand.profitRate * 100}%)`,
      value: formatPeso(totalProfit),
      icon: <TrendIcon />,
      emphasis: true,
    },
  ];

  const flavorBreakdown = Object.values(
    confirmedSales.reduce((acc, order) => {
      const key = order.flavor || order.product_name || "Unknown";

      if (!acc[key]) {
        acc[key] = { name: key, units: 0, revenue: 0 };
      }

      acc[key].units += Number(order.quantity || 0);
      acc[key].revenue += Number(order.subtotal || 0);

      return acc;
    }, {})
  ).sort((a, b) => b.revenue - a.revenue);

  const topRevenue = flavorBreakdown[0]?.revenue || 0;

  return (
    <main className="min-h-screen bg-[#FFF7F2] px-4 py-5 text-[#17191C] sm:px-5">
      <SEO
        title="Sales Report"
        description="Kuya King's sales performance by date range."
        path="/admin/sales"
        noIndex
      />
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6">
        <div className="lg:sticky lg:top-5 lg:self-start">
          <AdminSidebar />
        </div>

        <section className="min-w-0">
          <div className="kk-fade-in rounded-lg border border-[#E8E1DE] bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-widest text-[#C91F3A] sm:text-sm">
                  Admin Panel
                </p>

                <h1 className="mt-2 font-serif text-2xl font-bold leading-tight text-[#17191C] sm:text-3xl">
                  Sales Report
                </h1>

                <p className="mt-2 text-sm leading-6 text-[#5F5B58]">
                  Revenue, profit, and best sellers for the period below.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchOrders}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c91f3a] px-5 py-3 text-sm font-black text-white transition hover:opacity-90 sm:w-auto"
              >
                Refresh
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {RANGES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRange(item.id)}
                  className={`rounded-xl border px-4 py-2 text-sm font-black transition ${
                    range === item.id
                      ? "border-[#c91f3a] bg-[#c91f3a] text-white"
                      : "border-[#E8E1DE] text-[#17191C] hover:border-[#c91f3a]/40 hover:bg-[#FFF7F2]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="mt-5 rounded-lg border border-[#E8E1DE] bg-white p-8 text-center">
              <p className="font-black text-[#17191C]">Loading sales...</p>
            </div>
          ) : (
            <>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {cards.map((card, index) => (
                  <div
                    key={card.label}
                    className={`kk-fade-in min-w-0 rounded-lg border p-5 ${
                      card.emphasis
                        ? "border-[#c91f3a] bg-[#c91f3a]"
                        : "border-[#E8E1DE] bg-white"
                    }`}
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl [&_svg]:h-4 [&_svg]:w-4 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.6] ${
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

              <div className="kk-fade-in mt-5 rounded-lg border border-[#E8E1DE] bg-white p-5 sm:p-6" style={{ animationDelay: "160ms" }}>
                <p className="text-xs font-black uppercase tracking-widest text-[#C91F3A] sm:text-sm">
                  Best Sellers
                </p>
                <h2 className="mt-2 font-serif text-xl font-bold text-[#17191C]">
                  Sales by Product
                </h2>

                {flavorBreakdown.length === 0 ? (
                  <p className="mt-4 text-sm font-bold text-[#5F5B58]">
                    No confirmed sales in this range yet.
                  </p>
                ) : (
                  <div className="mt-5 space-y-4">
                    {flavorBreakdown.map((item, index) => (
                      <div key={item.name} className="kk-fade-in" style={{ animationDelay: `${200 + index * 70}ms` }}>
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <p className="font-black text-[#17191C]">{item.name}</p>
                          <p className="text-sm text-[#5F5B58]">
                            {item.units.toLocaleString("en-PH")} jar(s) &bull;{" "}
                            <span className="font-black text-[#c91f3a]">
                              {formatPeso(item.revenue)}
                            </span>
                          </p>
                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-xl bg-[#FFF7F2]">
                          <div
                            className="h-full rounded-xl bg-[#c91f3a]"
                            style={{
                              width: `${
                                topRevenue > 0 ? (item.revenue / topRevenue) * 100 : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="kk-fade-in mt-5 overflow-hidden rounded-lg border border-[#E8E1DE] bg-white" style={{ animationDelay: "240ms" }}>
                <div className="border-b border-[#E8E1DE] p-6">
                  <h2 className="font-serif text-xl font-bold text-[#17191C]">
                    Confirmed Sales in Range
                  </h2>
                  <p className="mt-1 text-sm text-[#5F5B58]">
                    Paid orders, and delivered COD orders, within the selected period.
                  </p>
                </div>

                {confirmedSales.length === 0 ? (
                  <div className="p-8 text-center text-sm text-[#5F5B58]">
                    No confirmed sales in this range yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] border-collapse text-left text-sm">
                      <thead className="bg-[#FFF7F2] text-[#17191C]">
                        <tr>
                          <th className="px-5 py-4">Order No.</th>
                          <th className="px-5 py-4">Date</th>
                          <th className="px-5 py-4">Product</th>
                          <th className="px-5 py-4">Qty</th>
                          <th className="px-5 py-4">Subtotal</th>
                          <th className="px-5 py-4">
                            Profit ({brand.profitRate * 100}%)
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {confirmedSales.map((order) => (
                          <tr key={order.id} className="border-t border-[#E8E1DE]">
                            <td className="px-5 py-4 font-black text-[#17191C]">
                              {order.order_number}
                            </td>
                            <td className="px-5 py-4">
                              {new Date(order.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-5 py-4">{order.flavor}</td>
                            <td className="px-5 py-4">{order.quantity}</td>
                            <td className="px-5 py-4 font-bold">
                              {formatPeso(order.subtotal)}
                            </td>
                            <td className="px-5 py-4 font-black text-[#c91f3a]">
                              {formatPeso(getOrderProfit(order))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default SalesReport;
