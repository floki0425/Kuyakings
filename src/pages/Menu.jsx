import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SEO from "../components/seo/SEO";
import IllustratedPanel from "../components/common/IllustratedPanel";
import Reveal from "../components/common/Reveal";
import { getFlavors } from "../lib/api.js";
import { breadcrumbJsonLd, seo } from "../lib/seo";
import { product } from "../lib/constants";

function JarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 8.5 6.5 5h11L20 8.5" />
      <rect x="4" y="8.5" width="16" height="2.2" rx="0.6" />
      <path d="m8.5 19.5-1-8h9l-1 8a2 2 0 0 1-2 1.8h-3a2 2 0 0 1-2-1.8Z" />
    </svg>
  );
}

const nutritionFacts = [
  { label: "Pack Size", value: product.packSize },
  { label: "Protein", value: product.protein },
  { label: "Calories", value: product.calories },
  { label: "Fat", value: product.fat },
  { label: "Carbohydrates", value: product.carbs },
];

function Menu() {
  const [flavors, setFlavors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFlavors() {
      const { data, error } = await getFlavors();

      if (!error) {
        setFlavors(data || []);
      }

      setIsLoading(false);
    }

    fetchFlavors();
  }, []);

  return (
    <main className="min-h-screen kk-bg-plain text-[#17191C]">
      <SEO
        title={seo.menuTitle}
        description={seo.menuDescription}
        path="/menu"
        jsonLd={({ canonicalUrl }) =>
          breadcrumbJsonLd([
            { name: "Home", url: canonicalUrl.replace(/\/menu$/, "/") },
            { name: "Menu", url: canonicalUrl },
          ])
        }
      />
      <Header />

      <section className="px-5 py-14 min-[421px]:py-16 lg:py-20">
        <div className="kk-fade-in mx-auto max-w-2xl text-center">
          <p className="text-xs font-black uppercase tracking-widest text-[#C91F3A]">
            Full Menu
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold leading-[1.05] text-[#17191C] min-[421px]:text-5xl">
            Every Kuya King&apos;s Flavor.
          </h1>

          <p className="mt-4 text-base leading-7 text-[#5F5B58]">
            Pick a flavor or grab the bundle. Every jar is homemade, prepared
            in small batches, and made with 100% pure beef.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <p className="col-span-full text-center text-sm font-bold text-[#6F6F70]">
              Loading products...
            </p>
          ) : flavors.length === 0 ? (
            <p className="col-span-full text-center text-sm font-bold text-[#6F6F70]">
              No products available right now.
            </p>
          ) : (
            flavors.map((item, index) => (
              <Reveal
                key={item.id || item.name}
                delay={index * 90}
                className="group overflow-hidden rounded-lg border border-[#E8E1DE] bg-white transition-all duration-200 hover:-translate-y-1 hover:border-[#c91f3a]/35 hover:shadow-[0_18px_36px_rgba(151,23,44,0.12)]"
              >
                <IllustratedPanel
                  icon={<JarIcon />}
                  imageUrl={item.image_url}
                  imageAlt={`Kuya King's ${item.name} Beef Tapa`}
                  className="h-52 w-full transition-transform duration-300 group-hover:scale-[1.04]"
                />

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-serif text-lg font-bold text-[#17191C]">
                      {item.name}
                    </p>

                    {!item.is_available && (
                      <span className="rounded-full bg-[#F3E4E4] px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wide text-[#97172C]">
                        Sold Out
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[#8a8580]">
                    {item.name.toLowerCase().startsWith("bundle")
                      ? "3 jars - any flavor"
                      : product.packSize}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-xl font-black text-[#c91f3a]">
                      &#8369;{item.price}
                    </span>

                    <Link
                      to={
                        item.is_available
                          ? `/order?flavor=${encodeURIComponent(item.name)}`
                          : "/order"
                      }
                      aria-disabled={!item.is_available}
                      className={`rounded-full px-4 py-2 text-xs font-black text-white transition ${
                        item.is_available
                          ? "bg-[#c91f3a] hover:opacity-90"
                          : "pointer-events-none bg-[#c9c4c0]"
                      }`}
                    >
                      Add to Cart
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))
          )}
        </div>
      </section>

      <section className="border-t border-[#E8E1DE] kk-bg-blush px-5 py-14 min-[421px]:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal as="div" className="text-center">
            <p className="text-xs font-black uppercase tracking-widest text-[#C91F3A]">
              Good To Know
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-[1.05] text-[#17191C] min-[421px]:text-4xl">
              Nutrition Facts
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#5F5B58]">
              Per serving, across all Kuya King&apos;s Beef Tapa flavors.
            </p>
          </Reveal>

          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-5">
            {nutritionFacts.map((fact, index) => (
              <Reveal
                key={fact.label}
                delay={index * 70}
                className="rounded-lg border border-[#E8E1DE] bg-white p-4 text-center"
              >
                <p className="text-lg font-black text-[#c91f3a]">
                  {fact.value}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[#8a8580]">
                  {fact.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default Menu;
