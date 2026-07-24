import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { brand } from "../lib/constants";
import { formatPeso, getOrderProfit } from "../lib/sales";
import StatusBadge from "../components/ui/StatusBadge";
import SEO from "../components/seo/SEO";

const PAYMENT_PROOF_BUCKET = "payment-proofs";
const PROOF_SIGNED_URL_SECONDS = 15 * 60;

function formatDate(dateValue) {
  if (!dateValue) return "N/A";

  return new Date(dateValue).toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-[1.8]">
      <path d="M20 12H4" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 fill-none stroke-current stroke-[1.8]">
      <rect x="8.5" y="8.5" width="11" height="11" rx="1.6" />
      <path d="M5.5 15.5v-9a1.6 1.6 0 0 1 1.6-1.6h9" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 19.5c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" />
    </svg>
  );
}

function JarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 8.5 6.5 5h11L20 8.5" />
      <rect x="4" y="8.5" width="16" height="2.2" rx="0.6" />
      <path d="m8.5 19.5-1-8h9l-1 8a2 2 0 0 1-2 1.8h-3a2 2 0 0 1-2-1.8Z" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="6.5" width="17" height="12" rx="2" />
      <path d="M3.5 10.5h17" />
      <circle cx="16" cy="14.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 6.5h11v9H3Z" />
      <path d="M14 10.5h4l3 3v2h-7Z" />
      <circle cx="7.5" cy="17" r="1.6" />
      <circle cx="17" cy="17" r="1.6" />
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

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchOrder = useCallback(async function fetchOrder() {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Fetch order error:", error);
      alert(`Failed to fetch order: ${error.message}`);
      setLoading(false);
      return;
    }

    setOrder(data);
    setLoading(false);
  }, [id]);

  async function updateOrderStatus(fields) {
    setSaving(true);

    const { data, error } = await supabase
      .from("orders")
      .update(fields)
      .eq("id", id)
      .select()
      .single();

    setSaving(false);

    if (error) {
      console.error("Update order error:", error);
      alert(`Failed to update order: ${error.message}`);
      return;
    }

    setOrder(data);
  }

  useEffect(() => {
    async function checkSessionAndFetchOrder() {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        navigate("/admin/login");
        return;
      }

      fetchOrder();
    }

    checkSessionAndFetchOrder();
  }, [fetchOrder, navigate]);

  function copyOrderNumber() {
    if (!order?.order_number) return;

    navigator.clipboard.writeText(order.order_number);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFF7F2] p-4">
        <SEO
          title="Order Details"
          description="Kuya King's admin order details."
          path={`/admin/orders/${id}`}
          noIndex
        />
        <div className="w-full max-w-md rounded-lg border border-[#E8E1DE] bg-white p-6 text-center">
          <p className="font-black text-[#17191C]">Loading order details...</p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFF7F2] p-4">
        <SEO
          title="Order Details"
          description="Kuya King's admin order details."
          path={`/admin/orders/${id}`}
          noIndex
        />
        <div className="w-full max-w-md rounded-lg border border-[#E8E1DE] bg-white p-6 text-center">
          <h1 className="font-serif text-2xl font-bold text-[#17191C] md:text-3xl">
            Order not found
          </h1>

          <Link
            to="/admin/dashboard"
            className="mt-6 inline-flex w-full justify-center rounded-xl bg-[#c91f3a] px-6 py-3 text-sm font-black text-white transition hover:opacity-90 sm:w-auto"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const profit = getOrderProfit(order);

  return (
    <main className="min-h-screen bg-[#FFF7F2] px-4 py-5 text-[#17191C] sm:px-5">
      <SEO
        title={`Order ${order.order_number}`}
        description="Kuya King's admin order details."
        path={`/admin/orders/${id}`}
        noIndex
      />
      <section className="mx-auto max-w-6xl">
        <div className="kk-fade-in rounded-lg border border-[#E8E1DE] bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-[#17191C] px-4 py-2 text-xs font-black text-[#17191C] transition hover:bg-[#17191C] hover:text-white"
              >
                <BackIcon />
                Back to Dashboard
              </Link>

              <p className="mt-5 text-xs font-black uppercase tracking-widest text-[#C91F3A] sm:text-sm">
                Order Details
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h1 className="break-all font-serif text-2xl font-bold leading-tight text-[#17191C] sm:text-3xl">
                  {order.order_number}
                </h1>

                <button
                  type="button"
                  onClick={copyOrderNumber}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#E8E1DE] bg-[#FFF7F2] px-3 py-1.5 text-xs font-black text-[#17191C] transition hover:border-[#c91f3a] hover:text-[#c91f3a]"
                >
                  <CopyIcon />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              <p className="mt-2 text-sm text-[#5F5B58]">
                Placed on {formatDate(order.created_at)}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge status={order.payment_status} />
                <StatusBadge status={order.order_status} />
              </div>
            </div>

            {saving && (
              <div className="w-fit rounded-xl border border-[#E8E1DE] bg-[#FFF7F2] px-4 py-2 text-xs font-black text-[#5F5B58]">
                Saving changes...
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-5">
            <div className="kk-fade-in rounded-lg border border-[#E8E1DE] bg-white p-5 sm:p-6" style={{ animationDelay: "60ms" }}>
              <p className="text-xs font-black uppercase tracking-widest text-[#C91F3A] sm:text-sm">
                Status Controls
              </p>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-sm font-black text-[#17191C]">
                    Payment Status
                  </label>

                  <select
                    value={order.payment_status}
                    onChange={(e) =>
                      updateOrderStatus({ payment_status: e.target.value })
                    }
                    className="kk-input mt-2"
                  >
                    <option>Pending</option>
                    <option>Paid</option>
                    <option>COD</option>
                    <option>Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-black text-[#17191C]">
                    Order Status
                  </label>

                  <select
                    value={order.order_status}
                    onChange={(e) =>
                      updateOrderStatus({ order_status: e.target.value })
                    }
                    className="kk-input mt-2"
                  >
                    <option>New Order</option>
                    <option>Confirmed</option>
                    <option>Preparing</option>
                    <option>Shipped / Out for Delivery</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <InfoCard title="Customer Information" icon={<UserIcon />} delay={0}>
                <Detail label="Name" value={order.customer_name} />
                <Detail label="Phone" value={order.phone} />
                <Detail label="Email" value={order.email || "N/A"} />
                <Detail label="Address" value={order.address} />
                <Detail label="City" value={order.city} />
                <Detail label="Landmark" value={order.landmark || "N/A"} />
              </InfoCard>

              <InfoCard title="Product Details" icon={<JarIcon />} delay={70}>
                <Detail label="Product" value={order.product_name} />
                <Detail label="Product Option" value={order.flavor} />
                <Detail label="Quantity" value={`${order.quantity} jar(s)`} />
                <Detail
                  label="Price per jar"
                  value={formatPeso(order.price_per_pack)}
                />
                <Detail label="Subtotal" value={formatPeso(order.subtotal)} />
              </InfoCard>

              <InfoCard title="Payment Details" icon={<WalletIcon />} delay={140}>
                <Detail label="Payment Method" value={order.payment_method} />
                <Detail label="Payment Status" value={order.payment_status} />
                <ProofPreview url={order.proof_of_payment_url} />
              </InfoCard>

              <InfoCard title="Delivery Details" icon={<TruckIcon />} delay={210}>
                <Detail
                  label="Delivery Option"
                  value={order.delivery_option || "To be confirmed"}
                />
                <Detail
                  label="Delivery Fee"
                  value="Customer shoulders delivery fee"
                />
                <Detail label="Notes" value={order.notes || "N/A"} />
              </InfoCard>
            </div>
          </div>

          <aside className="min-w-0 space-y-5 lg:sticky lg:top-5 lg:self-start">
            <div className="kk-fade-in rounded-lg border border-[#E8E1DE] bg-white p-5 sm:p-6" style={{ animationDelay: "100ms" }}>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#F8E6E4] text-[#c91f3a] [&_svg]:h-4 [&_svg]:w-4 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.6]">
                  <CoinsIcon />
                </span>
                <p className="text-xs font-black uppercase tracking-widest text-[#C91F3A] sm:text-sm">
                  Order Summary
                </p>
              </div>

              <div className="mt-5 space-y-4 text-sm">
                <SummaryRow label="Subtotal" value={formatPeso(order.subtotal)} />

                <div className="flex items-start justify-between gap-4">
                  <span className="text-[#5F5B58]">Payment</span>
                  <StatusBadge status={order.payment_status} />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-[#5F5B58]">Order</span>
                  <StatusBadge status={order.order_status} />
                </div>
              </div>

              <div className="mt-5 rounded-[0.85rem] bg-[#c91f3a] p-4">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm font-bold text-white/80">
                    Profit ({brand.profitRate * 100}%)
                  </span>
                  <span className="text-xl font-black text-white sm:text-2xl">
                    {formatPeso(profit)}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-white/70">
                  Counted only when payment is paid, or a COD order is
                  delivered and confirmed.
                </p>
              </div>
            </div>

            <div className="kk-fade-in rounded-lg border border-[#E8E1DE] bg-white p-5 sm:p-6" style={{ animationDelay: "160ms" }}>
              <p className="text-xs font-black uppercase tracking-widest text-[#C91F3A] sm:text-sm">
                Quick Actions
              </p>

              <div className="mt-5 grid gap-2.5">
                <button
                  onClick={() => updateOrderStatus({ payment_status: "Paid" })}
                  className="w-full rounded-xl border border-[#17191C] px-5 py-3 text-sm font-black text-[#17191C] transition hover:bg-[#17191C] hover:text-white"
                >
                  Mark as Paid
                </button>

                <button
                  onClick={() => updateOrderStatus({ order_status: "Confirmed" })}
                  className="w-full rounded-xl border border-[#17191C] px-5 py-3 text-sm font-black text-[#17191C] transition hover:bg-[#17191C] hover:text-white"
                >
                  Mark as Confirmed
                </button>

                <button
                  onClick={() => updateOrderStatus({ order_status: "Preparing" })}
                  className="w-full rounded-xl border border-[#17191C] px-5 py-3 text-sm font-black text-[#17191C] transition hover:bg-[#17191C] hover:text-white"
                >
                  Mark as Preparing
                </button>

                <button
                  onClick={() =>
                    updateOrderStatus({ order_status: "Shipped / Out for Delivery" })
                  }
                  className="w-full rounded-xl border border-[#17191C] px-5 py-3 text-sm font-black text-[#17191C] transition hover:bg-[#17191C] hover:text-white"
                >
                  Mark as Shipped / Out for Delivery
                </button>

                <button
                  onClick={() => updateOrderStatus({ order_status: "Delivered" })}
                  className="w-full rounded-xl border border-[#17191C] px-5 py-3 text-sm font-black text-[#17191C] transition hover:bg-[#17191C] hover:text-white"
                >
                  Mark as Delivered
                </button>

                <button
                  onClick={() =>
                    updateOrderStatus({
                      payment_status: "Cancelled",
                      order_status: "Cancelled",
                    })
                  }
                  className="w-full rounded-xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:opacity-90"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function InfoCard({ title, icon, children, delay = 0 }) {
  return (
    <div
      className="kk-fade-in min-w-0 rounded-lg border border-[#E8E1DE] bg-white p-5 sm:p-6"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#F8E6E4] text-[#c91f3a] [&_svg]:h-4 [&_svg]:w-4 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.6]">
          {icon}
        </span>
        <p className="text-xs font-black uppercase tracking-widest text-[#C91F3A] sm:text-sm">
          {title}
        </p>
      </div>

      <div className="mt-5 space-y-3 text-sm">{children}</div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <p className="break-words leading-6">
      <span className="font-black text-[#17191C]">{label}:</span>{" "}
      <span className="text-[#5F5B58]">{value}</span>
    </p>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-[#5F5B58]">{label}</span>
      <span className="break-words text-right font-black text-[#17191C]">
        {value}
      </span>
    </div>
  );
}

function ProofPreview({ url }) {
  const [signedProof, setSignedProof] = useState({
    path: "",
    url: "",
    error: "",
  });
  const isPublicUrl = url?.startsWith("http");
  const signedUrl = signedProof.path === url ? signedProof.url : "";
  const signedUrlError = signedProof.path === url ? signedProof.error : "";
  const isLoadingSignedUrl = Boolean(
    url && !isPublicUrl && !signedUrl && !signedUrlError
  );

  useEffect(() => {
    let isActive = true;

    if (!url || isPublicUrl) {
      return undefined;
    }

    async function loadSignedUrl() {
      const { data, error } = await supabase.storage
        .from(PAYMENT_PROOF_BUCKET)
        .createSignedUrl(url, PROOF_SIGNED_URL_SECONDS);

      if (!isActive) return;

      setSignedProof({
        path: url,
        url: data?.signedUrl || "",
        error: error?.message || "",
      });
    }

    loadSignedUrl();

    return () => {
      isActive = false;
    };
  }, [isPublicUrl, url]);

  if (!url) {
    return (
      <p className="break-words leading-6">
        <span className="font-black text-[#17191C]">Proof of Payment:</span>{" "}
        <span className="text-[#5F5B58]">N/A</span>
      </p>
    );
  }

  if (!isPublicUrl && !signedUrl) {
    return (
      <p className="break-words leading-6">
        <span className="font-black text-[#17191C]">Proof of Payment:</span>{" "}
        <span className="text-[#5F5B58]">
          {isLoadingSignedUrl
            ? "Opening private proof securely..."
            : `Private proof stored.${
                signedUrlError ? ` Could not create link: ${signedUrlError}` : ""
              }`}
        </span>{" "}
        <span className="hidden">
          {url} — not uploaded to storage yet
        </span>
      </p>
    );
  }

  const proofUrl = isPublicUrl ? url : signedUrl;

  return (
    <div className="space-y-3">
      <p className="break-words leading-6">
        <span className="font-black text-[#17191C]">Proof of Payment:</span>{" "}
        <a
          href={proofUrl}
          target="_blank"
          rel="noreferrer"
          className="font-bold text-[#c91f3a] underline"
        >
          Open full image
        </a>
      </p>

      <a
        href={proofUrl}
        target="_blank"
        rel="noreferrer"
        className="block overflow-hidden rounded-[0.85rem] border border-[#E8E1DE] bg-[#FFF7F2]"
      >
        <img
          src={proofUrl}
          alt="Proof of payment"
          className="max-h-[320px] w-full object-contain p-2"
        />
      </a>
    </div>
  );
}

export default OrderDetails;
