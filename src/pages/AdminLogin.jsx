import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please enter admin email and password.");
      return;
    }

    // Temporary mock login only.
    // Supabase Auth will replace this later.
    localStorage.setItem("isAdminLoggedIn", "true");

    navigate("/admin/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F1E7] px-5 py-12 text-[#2B2B2B]">
      <section className="w-full max-w-md rounded-[2rem] border border-[#D8D0C3] bg-white p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#25382B] text-xl font-black text-white">
            PG
          </div>

          <h1 className="mt-6 text-3xl font-black text-[#25382B]">
            Pure Grind Admin
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#555]">
            Login to manage orders, payment status, delivery status, and commission tracking.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-black text-[#25382B]">
              Admin Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@puregrindph.com"
              className="mt-2 w-full rounded-2xl border border-[#D8D0C3] bg-[#F8F1E7] px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-black text-[#25382B]">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="mt-2 w-full rounded-2xl border border-[#D8D0C3] bg-[#F8F1E7] px-4 py-3 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-[#D96C2C] px-6 py-4 font-black text-white shadow-sm transition hover:opacity-90"
          >
            Login
          </button>
        </form>

        <div className="mt-6 rounded-2xl bg-[#F8F1E7] p-4 text-center text-xs leading-5 text-[#555]">
          Temporary login muna ito. Any email and password will work for now.
          Supabase authentication will be added later.
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm font-black text-[#25382B] underline"
          >
            Back to Website
          </Link>
        </div>
      </section>
    </main>
  );
}

export default AdminLogin;