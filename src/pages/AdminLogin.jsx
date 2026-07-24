import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import SEO from "../components/seo/SEO";
import Turnstile from "../components/common/Turnstile";
import {
  checkLoginRateLimit,
  getAdminAccess,
  recordFailedLoginAttempt,
  signInWithEmail,
  signOut,
} from "../lib/auth.js";

const captchaRequired = Boolean(import.meta.env?.VITE_TURNSTILE_SITE_KEY);

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(location.state?.message || "");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileKey, setTurnstileKey] = useState(0);

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

    if (captchaRequired && !turnstileToken) {
      setLoginError("Please complete the verification challenge.");
      return;
    }

    setLoading(true);
    setLoginError("");

    try {
      const email = formData.email.trim();

      const { allowed, error: rateLimitError } = await checkLoginRateLimit(email);

      if (rateLimitError) {
        setLoginError(`Login failed: ${rateLimitError.message}`);
        return;
      }

      if (!allowed) {
        setLoginError(
          "Too many failed login attempts for this account. Please try again in 15 minutes."
        );
        return;
      }

      const { data, error } = await signInWithEmail(email, formData.password);

      if (error) {
        await recordFailedLoginAttempt(email);
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
      setTurnstileToken("");
      setTurnstileKey((key) => key + 1);
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
          <div className="kk-pop-in mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-[#E8E1DE] bg-white p-2.5">
            <img src="/favicon.svg" alt="Kuya King's" className="h-full w-full" />
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
            <div className="mt-2 text-right">
              <Link
                to="/admin/forgot-password"
                className="text-xs font-black text-[#5F5B58] transition hover:text-[#c91f3a]"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <Turnstile
            key={turnstileKey}
            onVerify={setTurnstileToken}
            onExpire={() => setTurnstileToken("")}
          />

          <button
            type="submit"
            disabled={loading || (captchaRequired && !turnstileToken)}
            className="w-full rounded-xl bg-[#c91f3a] px-6 py-4 font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
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
