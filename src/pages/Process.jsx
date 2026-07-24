import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SEO from "../components/seo/SEO";
import IllustratedPanel from "../components/common/IllustratedPanel";
import Reveal from "../components/common/Reveal";
import { breadcrumbJsonLd, seo } from "../lib/seo";
import { useSitePhotoSlots } from "../lib/useSitePhotoSlots";

function HandsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 13.5c0-1 .5-1.8 1.5-2.2L10 9.5" />
      <path d="M10 9.5V6a1.5 1.5 0 0 1 3 0v6" />
      <path d="M13 8v-.5a1.5 1.5 0 0 1 3 0V8" />
      <path d="M16 8.2a1.5 1.5 0 0 1 3 .3v3.5" />
      <path d="M4 13.5V16a5 5 0 0 0 5 5h4.5a5 5 0 0 0 5-5v-2.5" />
    </svg>
  );
}

function BeefIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6.5h12" />
      <path d="M8 4.5h8" />
      <path d="M7 9.5c0-2.2 1.8-4 4-4h2c2.2 0 4 1.8 4 4v7c0 2.2-1.8 4-4 4h-2c-2.2 0-4-1.8-4-4v-7Z" />
      <path d="M9.5 13.5h5" />
    </svg>
  );
}

function MarinadeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 3h4" />
      <path d="M11 3v3.2L7.5 11a4 4 0 0 0-.8 2.4V19a2 2 0 0 0 2 2h6.6a2 2 0 0 0 2-2v-5.6a4 4 0 0 0-.8-2.4L13 6.2V3" />
      <path d="M8.5 15h7" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m4 8 8-4 8 4-8 4-8-4Z" />
      <path d="M4 8v8l8 4 8-4V8" />
      <path d="M12 12v8" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="m8.5 12.2 2.4 2.4 4.6-4.6" />
    </svg>
  );
}

const steps = [
  {
    number: "01",
    title: "It starts with real beef, hand-picked.",
    text: "Every batch begins the same way our very first one did — 100% pure beef, chosen for the right cut and marbling. No fillers, no shortcuts, no factory line. Just real ingredients, prepared with care.",
    icon: <BeefIcon />,
  },
  {
    number: "02",
    title: "Then, the marinade goes to work.",
    text: "This is the part that makes Kuya King's taste like Kuya King's. Our own homemade marinade, worked into every slice and left to soak in — the same recipe we started with, still the only one we use.",
    icon: <MarinadeIcon />,
  },
  {
    number: "03",
    title: "Sealed while the flavor's at its best.",
    text: "Each pack is sealed right after marinating, while the flavor is freshest — so what reaches your kitchen tastes just like it did coming out of ours.",
    icon: <BoxIcon />,
  },
  {
    number: "04",
    title: "Ready for your table.",
    text: "Chilled, sealed, and ready to cook whenever the craving hits — one more jar in a small batch made the same homemade way, from our kitchen to yours.",
    icon: <CheckIcon />,
  },
];

function Process() {
  const photos = useSitePhotoSlots();

  return (
    <main className="min-h-screen kk-bg-plain text-[#17191C]">
      <SEO
        title={seo.processTitle}
        description={seo.processDescription}
        path="/process"
        jsonLd={({ canonicalUrl }) =>
          breadcrumbJsonLd([
            { name: "Home", url: canonicalUrl.replace(/\/process$/, "/") },
            { name: "Our Process", url: canonicalUrl },
          ])
        }
      />
      <Header />

      <section className="px-5 py-14 min-[421px]:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="kk-fade-in">
            <p className="text-xs font-black uppercase tracking-widest text-[#C91F3A]">
              From our kitchen to your table
            </p>

            <h1 className="mt-3 max-w-xl font-serif text-4xl font-bold leading-[1.02] text-[#17191C] min-[421px]:text-5xl">
              Made with Care.
              <span className="block text-[#97172C]">Sealed for Freshness.</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-[#5F5B58]">
              Every pack of Kuya King&apos;s goes through a carefully handled
              process from preparation to packaging to preserve the homemade
              flavor, quality, and freshness you love.
            </p>

            <Link
              to="/order"
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-[#c91f3a] px-6 py-3 text-sm font-black text-white transition hover:opacity-90"
            >
              Order Now
            </Link>
          </div>

          <IllustratedPanel
            icon={<HandsIcon />}
            caption="Made with Care"
            label="Prepared & sealed fresh"
            imageUrl={photos["process-page"]}
            imageAlt="Kuya King's Beef Tapa being prepared and packed"
            className="kk-fade-in h-[320px] w-full rounded-lg min-[421px]:h-[400px] lg:h-[460px]"
            style={{ animationDelay: "120ms" }}
          />
        </div>
      </section>

      <section className="border-t border-[#E8E1DE] kk-bg-blush px-5 py-14 min-[421px]:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal as="div" className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-widest text-[#C91F3A]">
              Our Process, Start to Finish
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-[1.05] text-[#17191C] min-[421px]:text-4xl">
              The Story Behind Every Jar.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#5F5B58]">
              It's the same process behind every batch since day one &mdash;
              no shortcuts, no factory line. Just real ingredients, handled
              with care, one step at a time.
            </p>
          </Reveal>

          <div className="relative mx-auto mt-14 max-w-2xl">
            <span
              aria-hidden="true"
              className="absolute bottom-2 left-6 top-2 w-px bg-[#c91f3a]/25 min-[421px]:left-7"
            />

            <ol className="space-y-10 min-[421px]:space-y-12">
              {steps.map((step, index) => (
                <Reveal
                  as="li"
                  key={step.number}
                  delay={index * 100}
                  className="relative flex gap-5 min-[421px]:gap-6"
                >
                  <span className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[#c91f3a]/30 bg-[#FFF7F2] text-[#c91f3a] shadow-[0_0_0_8px_#FFF7F2] min-[421px]:h-14 min-[421px]:w-14 [&_svg]:h-5 [&_svg]:w-5 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.5]">
                    {step.icon}
                  </span>

                  <div className="min-w-0 pt-1 min-[421px]:pt-2">
                    <p className="text-xs font-black uppercase tracking-widest text-[#8a8580]">
                      Step {step.number}
                    </p>
                    <h3 className="mt-1 font-serif text-xl font-bold leading-tight text-[#17191C] min-[421px]:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-lg text-sm leading-6 text-[#5F5B58] min-[421px]:text-base min-[421px]:leading-7">
                      {step.text}
                    </p>
                  </div>
                </Reveal>
              ))}

              <Reveal
                as="li"
                delay={steps.length * 100}
                className="relative flex gap-5 min-[421px]:gap-6"
              >
                <span className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#c91f3a] text-white shadow-[0_0_0_8px_#FFF7F2] min-[421px]:h-14 min-[421px]:w-14 [&_svg]:h-5 [&_svg]:w-5 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.5]">
                  <HandsIcon />
                </span>

                <div className="min-w-0 pt-1 min-[421px]:pt-2">
                  <h3 className="font-serif text-xl font-bold leading-tight text-[#17191C] min-[421px]:text-2xl">
                    And then, it&apos;s yours.
                  </h3>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-[#5F5B58] min-[421px]:text-base min-[421px]:leading-7">
                    That&apos;s the whole story behind every jar &mdash; no
                    factory, no shortcuts. Just a homemade kitchen doing it
                    the same way since our very first batch.
                  </p>
                  <Link
                    to="/order"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#c91f3a] transition hover:opacity-75"
                  >
                    Order Your Tapa
                    <span aria-hidden="true" className="kk-arrow-nudge">&rarr;</span>
                  </Link>
                </div>
              </Reveal>
            </ol>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default Process;
