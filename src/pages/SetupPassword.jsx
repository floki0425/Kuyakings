import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/seo/SEO";
import { supabase } from "../lib/supabaseClient";

function SetupPassword() {
  const [initialLinkError] = useState(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const message = hash.get("error_description");

    return message
      ? decodeURIComponent(message.replaceAll("+", " "))
      : "";
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [loading, setLoading] = useState(!initialLinkError);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(initialLinkError);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;

    if (initialLinkError) {
      return undefined;
    }

    async function checkSession() {
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (!active) return;

      if (sessionError) {
        setError(sessionError.message);
      } else if (data.session) {
        setSessionReady(true);
      }

      setLoading(false);
    }

    checkSession();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;

      if (session) {
        setSessionReady(true);
        setError("");
        setLoading(false);
      }
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [initialLinkError]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    await supabase.auth.signOut();
    setPassword("");
    setConfirmPassword("");
    setSuccess(true);
    setSaving(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF7F2] px-5 py-12 text-[#17191C]">
      <SEO
        title="Set Admin Password"
        description="Create your Kuya King's admin password."
        path="/admin/setup-password"
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
            Set Admin Password
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#5F5B58]">
            Choose a private password for your Kuya King&apos;s admin account.
          </p>
        </div>

        {loading ? (
          <p className="mt-8 text-center text-sm font-bold text-[#5F5B58]">
            Verifying your invitation...
          </p>
        ) : success ? (
          <div className="mt-8 text-center">
            <p className="rounded-[0.85rem] bg-green-50 p-4 text-sm font-bold text-green-800">
              Password created successfully. You can now log in.
            </p>
            <Link
              to="/admin/login"
              className="mt-5 inline-flex w-full justify-center rounded-full bg-[#c91f3a] px-6 py-4 font-black text-white transition hover:opacity-90"
            >
              Go to Admin Login
            </Link>
          </div>
        ) : sessionReady ? (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-black text-[#17191C]">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                className="kk-input mt-2"
              />
            </div>

            <div>
              <label className="text-sm font-black text-[#17191C]">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                className="kk-input mt-2"
              />
            </div>

            {error ? (
              <p className="rounded-[0.85rem] bg-red-50 p-4 text-sm font-bold text-red-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-full bg-[#c91f3a] px-6 py-4 font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Create Password"}
            </button>
          </form>
        ) : (
          <div className="mt-8 text-center">
            <p className="rounded-[0.85rem] bg-red-50 p-4 text-sm font-bold text-red-700">
              {error || "This invitation link is invalid or has expired."}
            </p>
            <Link
              to="/admin/login"
              className="mt-5 inline-flex font-black text-[#5F5B58] transition hover:text-[#c91f3a]"
            >
              Back to Admin Login
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

export default SetupPassword;
