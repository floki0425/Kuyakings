import { Link } from "react-router-dom";
import IllustratedPanel from "../common/IllustratedPanel";
import Reveal from "../common/Reveal";

function RiceBowlIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.5 12h17a7.5 6 0 0 1-17 0Z" />
      <path d="M12 12V5.5" />
      <path d="M9 7.5c0-1.4 1.3-2.5 3-2.5s3 1.1 3 2.5" />
    </svg>
  );
}

function AtcharaIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 3h6" />
      <path d="M10 3v3.6L7.4 9.4A3 3 0 0 0 6.5 11.5V19a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-7.5a3 3 0 0 0-.9-2.1L14 6.6V3" />
      <path d="M7 14h10" />
    </svg>
  );
}

const pairings = [
  {
    name: "Garlic Rice",
    description:
      "Warm, fragrant, and perfectly buttery—the ultimate partner for all things real. For that home-cooked flavor.",
    icon: <RiceBowlIcon />,
  },
  {
    name: "Atchara",
    description:
      "A refreshing pickled side that complements Beef Tapa's savory richness perfectly.",
    icon: <AtcharaIcon />,
  },
];

function PerfectPair() {
  return (
    <section
      id="perfect-pair"
      className="kk-pairing bg-[#FFF7F2] px-5 py-14 min-[421px]:py-20 lg:py-24"
    >
      <Reveal as="div" className="kk-pairing-header mx-auto max-w-2xl text-center">
        <p className="kk-pairing-eyebrow text-xs font-black uppercase tracking-widest text-[#C91F3A]">
          Complete your plate
        </p>

        <h2 className="kk-pairing-heading mt-3 font-serif text-3xl font-bold leading-[1.05] text-[#17191C] min-[421px]:text-4xl">
          The Perfect Pair for Your Tapa.
        </h2>

        <p className="kk-pairing-subheading mt-4 text-sm leading-6 text-[#5F5B58] min-[421px]:text-base">
          Great tapa deserves the perfect match. Pair your Kuya King&apos;s
          favorites with comforting sides that turn every serving into a
          complete and satisfying meal.
        </p>
      </Reveal>

      <div className="kk-pairing-grid mx-auto mt-10 grid max-w-5xl gap-8 min-[421px]:grid-cols-2 min-[421px]:gap-6 lg:gap-10">
        {pairings.map((item, index) => (
          <Reveal key={item.name} delay={index * 110} className="kk-pairing-item">
            <IllustratedPanel
              icon={item.icon}
              className="kk-pairing-media h-56 w-full rounded-lg min-[421px]:h-64"
            />

            <h3 className="kk-pairing-name mt-5 font-serif text-xl font-bold text-[#17191C]">
              {item.name}
            </h3>

            <p className="kk-pairing-copy mt-2 max-w-sm text-sm leading-6 text-[#6F6F70]">
              {item.description}
            </p>

            <Link
              to="/order"
              className="kk-pairing-link mt-3 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#c91f3a] transition hover:text-[#97172C]"
            >
              Add to Your Meal
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="kk-arrow-nudge h-3.5 w-3.5 fill-none stroke-current stroke-[2.2]"
              >
                <path d="M4 12h16" strokeLinecap="round" />
                <path d="m13 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default PerfectPair;
