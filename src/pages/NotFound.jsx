import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SEO from "../components/seo/SEO";

function JarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-none stroke-current stroke-[1.6]">
      <path d="M4 8.5 6.5 5h11L20 8.5" />
      <rect x="4" y="8.5" width="16" height="2.2" rx="0.6" />
      <path d="m8.5 19.5-1-8h9l-1 8a2 2 0 0 1-2 1.8h-3a2 2 0 0 1-2-1.8Z" />
    </svg>
  );
}

const helpfulLinks = [
  { label: "Full Menu", to: "/menu" },
  { label: "Track Your Order", to: "/track-order" },
  { label: "Our Process", to: "/process" },
  { label: "Contact Us", to: "/contact" },
];

function NotFound() {
  return (
    <main className="flex min-h-screen flex-col bg-[#FFF7F2] text-[#17191C]">
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist."
        path="/404"
        noIndex
      />
      <Header />

      <section className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="kk-fade-in w-full max-w-lg rounded-lg border border-[#E8E1DE] bg-white p-8 text-center sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F8E6E4] text-[#c91f3a]">
            <JarIcon />
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-widest text-[#C91F3A]">
            404 Error
          </p>

          <h1 className="mt-3 font-serif text-3xl font-bold leading-[1.1] text-[#17191C] sm:text-4xl">
            This page wandered off the plate.
          </h1>

          <p className="mx-auto mt-4 max-w-md leading-7 text-[#5F5B58]">
            We couldn&apos;t find the page you were looking for. It may have
            been moved, or the link might be outdated.
          </p>

          <Link
            to="/"
            className="mt-7 inline-flex items-center justify-center rounded-full bg-[#c91f3a] px-6 py-3 text-sm font-black text-white transition hover:opacity-90"
          >
            Back to Home
          </Link>

          <div className="mt-8 grid gap-3 border-t border-[#E8E1DE] pt-6 sm:grid-cols-2">
            {helpfulLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-full border border-[#E8E1DE] px-4 py-2.5 text-sm font-black text-[#17191C] transition hover:border-[#c91f3a]/40 hover:text-[#c91f3a]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default NotFound;
