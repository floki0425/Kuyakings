import { Link } from "react-router-dom";
import IllustratedPanel from "../common/IllustratedPanel";
import Reveal from "../common/Reveal";
import { useSitePhotoSlots } from "../../lib/useSitePhotoSlots";

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

function BatchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10h16l-1.4 8.2a2 2 0 0 1-2 1.8H7.4a2 2 0 0 1-2-1.8L4 10Z" />
      <path d="M8 10V8a4 4 0 0 1 8 0v2" />
    </svg>
  );
}

function MealIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 3v6.5a2 2 0 0 0 4 0V3" />
      <path d="M8 9.5V21" />
      <path d="M16 3c-1.4 0-2.5 1.6-2.5 4.5S14.6 12 16 12s2.5-1.6 2.5-4.5S17.4 3 16 3Z" />
      <path d="M16 12v9" />
    </svg>
  );
}

const highlights = [
  {
    title: "Premium-Quality Beef",
    text: "Sourced from select farms, tender and dependable.",
    icon: <BeefIcon />,
  },
  {
    title: "Our Signature Marinade",
    text: "A carefully balanced recipe crafted by Kuya King's.",
    icon: <MarinadeIcon />,
  },
  {
    title: "Prepared in Small Batches",
    text: "Made with patience and care so each jar meets our high standards.",
    icon: <BatchIcon />,
  },
  {
    title: "Made for Any Meal",
    text: "Perfect with rice, breakfast, pinoy-style lunches, or anytime.",
    icon: <MealIcon />,
  },
];

function Benefits() {
  const photos = useSitePhotoSlots();

  return (
    <section
      id="benefits"
      className="kk-story kk-bg-plain px-5 py-14 min-[421px]:py-20 lg:py-24"
    >
      <div className="kk-story-layout mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <Reveal className="kk-story-content">
          <p className="kk-story-eyebrow text-xs font-black uppercase tracking-widest text-[#C91F3A]">
            Everyday, from the heart
          </p>

          <h2 className="kk-story-heading mt-3 max-w-xl font-serif text-4xl font-bold leading-[1.02] text-[#17191C] min-[421px]:text-5xl">
            Homemade Goodness
            <span className="block">In Every Bite.</span>
          </h2>

          <p className="kk-story-copy mt-5 max-w-lg text-base leading-7 text-[#5F5B58]">
            Our very first batch was made the same way Beef Tapa should
            be&mdash;simple, real, and honest. That&apos;s why our tapa
            still tastes like home to so many today. Made from 100%
            homemade passion.
          </p>

          <div className="kk-story-highlights mt-8 grid gap-x-6 gap-y-6 sm:grid-cols-2">
            {highlights.map((item, index) => (
              <Reveal
                key={item.title}
                delay={index * 90}
                className="kk-story-highlight flex gap-3"
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[#c91f3a]/30 bg-[#F8E6E4] text-[#c91f3a] [&_svg]:h-5 [&_svg]:w-5 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.5]">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-black leading-5 text-[#17191C]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-[#6F6F70]">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Link
            to="/about"
            className="kk-story-link mt-8 inline-flex items-center gap-2 text-sm font-black text-[#c91f3a] transition hover:opacity-75"
          >
            Read Our Full Story
            <span aria-hidden="true" className="kk-arrow-nudge">&rarr;</span>
          </Link>
        </Reveal>

        <Reveal delay={120}>
          <IllustratedPanel
            icon={<BatchIcon />}
            caption="Homemade Goodness"
            label="From our kitchen"
            imageUrl={photos.story}
            imageAlt="Kuya King's Beef Tapa, homemade goodness"
            className="kk-story-media h-[320px] w-full rounded-lg min-[421px]:h-[400px] lg:h-[460px]"
          />
        </Reveal>
      </div>
    </section>
  );
}

export default Benefits;
