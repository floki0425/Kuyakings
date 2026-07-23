import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFlavors } from "../../lib/api.js";
import IllustratedPanel from "../common/IllustratedPanel";
import Reveal from "../common/Reveal";
import { product } from "../../lib/constants";

function JarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 8.5 6.5 5h11L20 8.5" />
      <rect x="4" y="8.5" width="16" height="2.2" rx="0.6" />
      <path d="m8.5 19.5-1-8h9l-1 8a2 2 0 0 1-2 1.8h-3a2 2 0 0 1-2-1.8Z" />
    </svg>
  );
}

function Flavors() {
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
    <section
      id="flavors"
      className="kk-best kk-bg-plain px-5 py-14 min-[421px]:py-20 lg:py-24"
    >
      <Reveal as="div" className="kk-best-header mx-auto max-w-2xl text-center">
        <p className="kk-best-eyebrow text-xs font-black uppercase tracking-widest text-[#C91F3A]">
          Kuya King&apos;s favorites
        </p>

        <h2 className="kk-best-heading mt-3 font-serif text-3xl font-bold leading-[1.05] text-[#17191C] min-[421px]:text-4xl">
          Find Your Favorite.
        </h2>

        <p className="kk-best-copy mt-4 text-sm leading-6 text-[#5F5B58] min-[421px]:text-base">
          From the original flavor that started it all to something with an
          extra kick, there&apos;s a Kuya King&apos;s favorite for every
          craving.
        </p>
      </Reveal>

      <div className="kk-best-grid mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              className="kk-best-product group overflow-hidden rounded-lg border border-[#E8E1DE] bg-white transition-all duration-200 hover:-translate-y-1 hover:border-[#c91f3a]/35 hover:shadow-[0_18px_36px_rgba(151,23,44,0.12)]"
            >
              <IllustratedPanel
                icon={<JarIcon />}
                imageUrl={item.image_url}
                imageAlt={`Kuya King's ${item.name} Beef Tapa`}
                className="kk-best-product-media h-52 w-full transition-transform duration-300 group-hover:scale-[1.04]"
              />

              <div className="kk-best-product-info p-5">
                <div className="flex items-start justify-between gap-3">
                  <p className="kk-best-product-name font-serif text-lg font-bold text-[#17191C]">
                    {item.name}
                  </p>

                  {!item.is_available && (
                    <span className="rounded-full bg-[#F3E4E4] px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wide text-[#97172C]">
                      Sold Out
                    </span>
                  )}
                </div>

                <p className="kk-best-product-meta mt-1 text-xs font-bold uppercase tracking-wide text-[#8a8580]">
                  {item.name.toLowerCase().startsWith("bundle")
                    ? "3 jars - any flavor"
                    : product.packSize}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="kk-best-product-price text-xl font-black text-[#c91f3a]">
                    &#8369;{item.price}
                  </span>

                  <Link
                    to={
                      item.is_available
                        ? `/order?flavor=${encodeURIComponent(item.name)}`
                        : "/order"
                    }
                    aria-disabled={!item.is_available}
                    className={`kk-best-product-action rounded-full px-4 py-2 text-xs font-black text-white transition ${
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

      <div className="mt-10 text-center">
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 text-sm font-black text-[#c91f3a] transition hover:opacity-75"
        >
          View Full Menu &amp; Nutrition Facts
          <span aria-hidden="true" className="kk-arrow-nudge">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}

export default Flavors;
