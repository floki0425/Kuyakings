import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import SEO from "../components/seo/SEO";
import { getAdminAccess, signInWithEmail, signOut } from "../lib/auth.js";

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(location.state?.message || "");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      setLoginError("Please enter admin email and password.");
      return;
    }

    setLoading(true);
    setLoginError("");

    try {
      const { data, error } = await signInWithEmail(
        formData.email.trim(),
        formData.password
      );

      if (error) {
        setLoginError(`Login failed: ${error.message}`);
        return;
      }

      const { isAdmin, error: accessError } = await getAdminAccess(data.user);

      if (accessError || !isAdmin) {
        await signOut();
        setLoginError(
          accessError
            ? `Admin access check failed: ${accessError.message}`
            : "Your login is valid, but this account has not been assigned admin access."
        );
        return;
      }

      navigate("/admin/dashboard");
    } catch (error) {
      setLoginError(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF7F2] px-5 py-12 text-[#17191C]">
      <SEO
        title="Admin Login"
        description="Kuya King's admin login."
        path="/admin/login"
        noIndex
      />
      <section className="kk-fade-in w-full max-w-md rounded-lg border border-[#E8E1DE] bg-white p-8">
        <div className="text-center">
          <div className="kk-pop-in mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#c91f3a] text-lg font-black text-white">
            KK
          </div>

          <p className="mt-5 text-xs font-black uppercase tracking-widest text-[#C91F3A]">
            Admin Panel
          </p>

          <h1 className="mt-2 font-serif text-3xl font-bold text-[#17191C]">
            Kuya King&apos;s Admin
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#5F5B58]">
            Sign in to manage orders, payment status, delivery status, and
            profit tracking.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {loginError && (
            <p
              role="alert"
              className="rounded-[0.85rem] bg-red-50 p-4 text-sm font-bold leading-6 text-red-700"
            >
              {loginError}
            </p>
          )}

          <div>
            <label className="text-sm font-black text-[#17191C]">
              Admin Email
            </label>
            <input
              type="email"
              name="email"
              autoComplete="username"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              className="kk-input mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-black text-[#17191C]">
              Password
            </label>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="kk-input mt-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#c91f3a] px-6 py-4 font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm font-black text-[#5F5B58] transition hover:text-[#c91f3a]"
          >
            &larr; Back to Website
          </Link>
        </div>
      </section>
    </main>
  );
}

export default AdminLogin;
