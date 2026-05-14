import { Link, useNavigate } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/admin/login");
  }

  return (
    <aside className="rounded-[2rem] border border-[#D8D0C3] bg-white p-6 shadow-sm">
      <div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25382B] text-lg font-black text-white">
          PG
        </div>

        <h2 className="mt-5 text-xl font-black text-[#25382B]">
          Pure Grind Admin
        </h2>

        <p className="mt-1 text-sm leading-6 text-[#555]">
          Manage orders, payment status, delivery status, and commission.
        </p>
      </div>

      <nav className="mt-8 space-y-3">
        <Link
          to="/admin/dashboard"
          className="block rounded-2xl bg-[#25382B] px-4 py-3 text-sm font-black text-white"
        >
          Dashboard
        </Link>

        <Link
          to="/"
          className="block rounded-2xl border border-[#D8D0C3] px-4 py-3 text-sm font-black text-[#25382B]"
        >
          View Website
        </Link>

        <Link
          to="/order"
          className="block rounded-2xl border border-[#D8D0C3] px-4 py-3 text-sm font-black text-[#25382B]"
        >
          View Order Page
        </Link>

        <button
        onClick={() => {
        handleLogout()
        }}
       className="block w-full rounded-2xl border border-[#D8D0C3] px-4 py-3 text-left text-sm font-black text-[#25382B]"
>
  Logout
</button>
      </nav>
    </aside>
  );
}

export default AdminSidebar;