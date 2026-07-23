import { Link } from "react-router-dom";
import IllustratedPanel from "../common/IllustratedPanel";
import Reveal from "../common/Reveal";
import { useSitePhotoSlots } from "../../lib/useSitePhotoSlots";
import ctaBackground from "../../assets/final cta background.png";

function PlateIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
    </svg>
  );
}

function CTA() {
  const photos = useSitePhotoSlots();

  return (
    <Reveal
      as="section"
      style={{ backgroundImage: `url(${ctaBackground})` }}
      className="kk-cta kk-cta-bg relative isolate"
    >
      <div className="kk-cta-inner mx-auto grid max-w-7xl items-center gap-8 px-5 py-14 min-[421px]:py-16 lg:grid-cols-[0.85fr_1.15fr_auto] lg:py-20">
        <IllustratedPanel
          icon={<PlateIcon />}
          label="Kuya King's"
          tone="dark"
          imageUrl={photos.cta}
          imageAlt="Kuya King's Beef Tapa"
          className="kk-cta-media h-52 w-full rounded-lg min-[421px]:h-64 lg:h-full lg:min-h-[280px]"
        />

        <div className="kk-cta-content px-6 py-8 text-center min-[421px]:px-10 lg:px-2 lg:text-left">
          <p className="kk-cta-eyebrow text-xs font-black uppercase tracking-widest text-white/70">
            Ready when the craving hits
          </p>

          <h2 className="kk-cta-heading mt-3 font-serif text-3xl font-bold leading-[1.05] text-white min-[421px]:text-4xl lg:text-5xl">
            Bring Home the Taste
            <span className="block">of Kuya King&apos;s.</span>
          </h2>

          <p className="kk-cta-copy mx-auto mt-4 max-w-md text-sm leading-6 text-white/80 lg:mx-0">
            Enjoy tender, flavorful homemade Beef Tapa made with 100% pure
            beef and our signature recipe.
          </p>
        </div>

        <div className="kk-cta-actions flex flex-col gap-3 px-6 pb-8 min-[421px]:px-10 min-[421px]:flex-row lg:flex-col lg:px-8 lg:pb-0">
          <Link
            to="/order"
            className="kk-cta-primary inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-black text-[#97172C] transition hover:opacity-90"
          >
            Order Your Tapa
          </Link>
          <Link
            to="/#flavors"
            className="kk-cta-secondary inline-flex items-center justify-center rounded-full border border-white/50 px-6 py-3 text-sm font-black text-white transition hover:border-white"
          >
            View Best Sellers
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

export default CTA;
