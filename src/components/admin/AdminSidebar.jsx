import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="1.4" />
      <rect x="13" y="4" width="7" height="4.5" rx="1.4" />
      <rect x="13" y="11" width="7" height="9" rx="1.4" />
      <rect x="4" y="14" width="7" height="6" rx="1.4" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="1.8" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m5 17 4.5-4.5L12 15l3-3 4 4.5" />
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

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="6" width="17" height="12" rx="2.2" />
      <path d="M3.5 10h17" />
      <circle cx="16" cy="14" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16" />
      <path d="M12 4c2.4 2.2 3.6 5 3.6 8s-1.2 5.8-3.6 8c-2.4-2.2-3.6-5-3.6-8s1.2-5.8 3.6-8Z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5h2l1.6 10.2a1.8 1.8 0 0 0 1.8 1.5h7.4a1.8 1.8 0 0 0 1.8-1.5L20 8H6.2" />
      <circle cx="10" cy="20" r="1.3" />
      <circle cx="17" cy="20" r="1.3" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v9a1.5 1.5 0 0 1-1.5 1.5H9l-4 3v-3H5.5A1.5 1.5 0 0 1 4 15.5v-9Z" />
      <path d="m6 8 6 4.5L18 8" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 7V5.5A1.5 1.5 0 0 0 12.5 4h-6A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20h6a1.5 1.5 0 0 0 1.5-1.5V17" />
      <path d="M10 12h10" />
      <path d="m16.5 8.5 3.5 3.5-3.5 3.5" />
    </svg>
  );
}

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
  { to: "/admin/sales", label: "Sales", icon: <TrendIcon /> },
  { to: "/admin/brand-assets", label: "Brand Assets", icon: <ImageIcon /> },
  { to: "/admin/payment-settings", label: "Payment Settings", icon: <WalletIcon /> },
  { to: "/admin/contact-messages", label: "Messages", icon: <MessageIcon /> },
];

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(`Logout failed: ${error.message}`);
      return;
    }

    navigate("/admin/login");
  }

  return (
    <aside className="kk-fade-in rounded-lg border border-[#E8E1DE] bg-white p-6">
      <div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E8E1DE] bg-white p-2">
          <img src="/favicon.svg" alt="Kuya King's" className="h-full w-full" />
        </div>

        <h2 className="mt-4 font-serif text-xl font-bold text-[#17191C]">
          Kuya King&apos;s Admin
        </h2>

        <p className="mt-1 text-sm leading-6 text-[#8a8580]">
          Manage orders, payment status, delivery status, and profit.
        </p>
      </div>

      <nav className="mt-7 space-y-2">
        {adminLinks.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 rounded-[0.85rem] px-4 py-3 text-sm font-black transition [&_svg]:h-4 [&_svg]:w-4 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.8] ${
              location.pathname === item.to
                ? "bg-[#c91f3a] text-white"
                : "border border-[#E8E1DE] text-[#17191C] hover:border-[#c91f3a]/40 hover:bg-[#FFF7F2]"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}

        <Link
          to="/"
          className="flex items-center gap-3 rounded-[0.85rem] border border-[#E8E1DE] px-4 py-3 text-sm font-black text-[#17191C] transition hover:border-[#c91f3a]/40 hover:bg-[#FFF7F2] [&_svg]:h-4 [&_svg]:w-4 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.8]"
        >
          <GlobeIcon />
          View Website
        </Link>

        <Link
          to="/order"
          className="flex items-center gap-3 rounded-[0.85rem] border border-[#E8E1DE] px-4 py-3 text-sm font-black text-[#17191C] transition hover:border-[#c91f3a]/40 hover:bg-[#FFF7F2] [&_svg]:h-4 [&_svg]:w-4 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.8]"
        >
          <CartIcon />
          View Order Page
        </Link>

        <div className="mt-5! border-t border-[#E8E1DE] pt-5">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-[0.85rem] border border-transparent px-4 py-3 text-left text-sm font-black text-[#c91f3a] transition hover:border-[#c91f3a]/30 hover:bg-[#F8E6E4] [&_svg]:h-4 [&_svg]:w-4 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.8]"
          >
            <LogoutIcon />
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
}

export default AdminSidebar;
