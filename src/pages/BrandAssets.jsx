import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import PhotoUploadManager from "../components/admin/PhotoUploadManager";
import TextContentManager from "../components/admin/TextContentManager";
import SEO from "../components/seo/SEO";
import { getAdminSession, signOut } from "../lib/auth";

function BrandAssets() {
  const navigate = useNavigate();

  useEffect(() => {
    async function checkSession() {
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
      }
    }

    checkSession();
  }, [navigate]);

  return (
    <main className="min-h-screen bg-[#FFF7F2] px-4 py-5 text-[#17191C] sm:px-5">
      <SEO
        title="Brand Assets"
        description="Manage Kuya King's homepage and order page photos."
        path="/admin/brand-assets"
        noIndex
      />
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6">
        <div className="lg:sticky lg:top-5 lg:self-start">
          <AdminSidebar />
        </div>

        <section className="min-w-0">
          <div className="kk-fade-in rounded-lg border border-[#E8E1DE] bg-white p-5 sm:p-6">
            <p className="text-xs font-black uppercase tracking-widest text-[#C91F3A] sm:text-sm">
              Admin Panel
            </p>

            <h1 className="mt-2 font-serif text-2xl font-bold leading-tight text-[#17191C] sm:text-3xl">
              Brand Assets
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#5F5B58]">
              Upload the hero, product, and gallery photos shown on the live
              site. Uploaded photos replace the illustrated placeholders
              immediately for every visitor.
            </p>
          </div>

          <PhotoUploadManager />
          <TextContentManager />
        </section>
      </div>
    </main>
  );
}

export default BrandAssets;
