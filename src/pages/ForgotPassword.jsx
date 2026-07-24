import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/seo/SEO";
import { requestPasswordReset } from "../lib/auth.js";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim()) {
      setError("Please enter your admin email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await requestPasswordReset(email.trim());
      // Always show the same success message, whether or not the email
      // matches an account, so this form can't be used to enumerate admins.
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF7F2] px-5 py-12 text-[#17191C]">
      <SEO
        title="Forgot Password"
        description="Reset your Kuya King's admin password."
        path="/admin/forgot-password"
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
            Reset Your Password
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#5F5B58]">
            Enter your admin email and we&apos;ll send you a link to set a
            new password.
          </p>
        </div>

        {submitted ? (
          <div className="mt-8 text-center">
            <p className="rounded-[0.85rem] bg-green-50 p-4 text-sm font-bold text-green-800">
              If that email belongs to an admin account, a reset link is on
              its way. Check your inbox (and spam folder).
            </p>
            <Link
              to="/admin/login"
              className="mt-5 inline-flex w-full justify-center rounded-xl bg-[#c91f3a] px-6 py-4 font-black text-white transition hover:opacity-90"
            >
              Back to Admin Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <p
                role="alert"
                className="rounded-[0.85rem] bg-red-50 p-4 text-sm font-bold leading-6 text-red-700"
              >
                {error}
              </p>
            )}

            <div>
              <label className="text-sm font-black text-[#17191C]">
                Admin Email
              </label>
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter admin email"
                className="kk-input mt-2"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#c91f3a] px-6 py-4 font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/admin/login"
            className="text-sm font-black text-[#5F5B58] transition hover:text-[#c91f3a]"
          >
            &larr; Back to Admin Login
          </Link>
        </div>
      </section>
    </main>
  );
}

export default ForgotPassword;
