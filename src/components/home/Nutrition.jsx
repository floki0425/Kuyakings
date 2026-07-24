import { Link } from "react-router-dom";
import IllustratedPanel from "../common/IllustratedPanel";
import Reveal from "../common/Reveal";
import { useSitePhotoSlots } from "../../lib/useSitePhotoSlots";

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

function Nutrition() {
  const photos = useSitePhotoSlots();
  const items = [
    [
      "01",
      "Prepared",
      "We start with carefully selected quality beef, prepared with attention to tenderness, consistency, and flavor.",
    ],
    [
      "02",
      "Marinated",
      "Each batch is marinated using Kuya King's signature homemade recipe to develop its rich and savory flavor.",
    ],
    [
      "03",
      "Packed",
      "Every product is carefully packed to help preserve its quality, flavor, and freshness.",
    ],
    [
      "04",
      "Ready",
      "Sealed, prepared, and ready to enjoy whenever your next Kuya King's craving hits.",
    ],
  ];

  return (
    <section
      id="nutrition"
      className="kk-process-section kk-bg-plain px-5 py-16 min-[421px]:py-20 lg:py-24"
    >
      <div className="kk-process-layout mx-auto grid max-w-7xl items-center gap-8 border-y border-[#E8E1DE] py-10 min-[421px]:gap-10 min-[421px]:py-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-x-14 lg:gap-y-8 lg:py-14">
        <Reveal className="kk-process-content lg:col-start-2 lg:row-start-1">
          <p className="kk-process-eyebrow text-xs font-black uppercase text-[#C91F3A]">
            From our kitchen to your table
          </p>

          <h2 className="kk-process-heading mt-3 max-w-2xl font-serif text-4xl font-bold leading-[0.98] text-[#17191C] min-[421px]:text-5xl lg:text-6xl">
            Made with Care.
            <span className="block text-[#97172C]">Sealed for Freshness.</span>
          </h2>

          <p className="kk-process-intro mt-5 max-w-xl text-base leading-7 text-[#5F5B58] min-[421px]:text-lg">
            Every pack of Kuya King&apos;s goes through a carefully handled
            process from preparation to packaging to preserve the homemade
            flavor, quality, and freshness you love.
          </p>

          <Link
            to="/process"
            className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[#c91f3a] transition hover:opacity-75"
          >
            See Our Full Process
            <span aria-hidden="true" className="kk-arrow-nudge">&rarr;</span>
          </Link>
        </Reveal>

        <Reveal delay={120} className="lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <IllustratedPanel
            icon={<HandsIcon />}
            caption="Made with Care"
            label="Prepared & sealed fresh"
            imageUrl={photos.gallery}
            imageAlt="Kuya King's Beef Tapa being prepared and packed"
            className="kk-process-media h-[340px] w-full rounded-lg min-[421px]:h-[430px] lg:h-[560px]"
          />
        </Reveal>

        <ol className="kk-process-timeline relative grid gap-7 min-[421px]:grid-cols-2 min-[421px]:gap-x-8 min-[421px]:gap-y-9 lg:col-start-2 lg:row-start-2 lg:grid-cols-4 lg:gap-x-6">
          <span
            aria-hidden="true"
            className="absolute left-[12.5%] right-[12.5%] top-[1.125rem] hidden h-px bg-[#D9D0CB] lg:block"
          />

          {items.map(([number, title, description], index) => (
            <Reveal
              as="li"
              key={number}
              delay={index * 100}
              className={[
                "kk-process-step relative grid grid-cols-[3rem_1fr] gap-x-4 min-[421px]:block",
                index < items.length - 1
                  ? "after:absolute after:bottom-[-1.75rem] after:left-[1.125rem] after:top-11 after:w-px after:bg-[#D9D0CB] min-[421px]:after:hidden"
                  : "",
              ].join(" ")}
            >
              <span className="kk-process-step-number relative z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-[#C91F3A]/35 bg-[#FFFDFC] text-sm font-black text-[#C91F3A] shadow-[0_0_0_8px_#FFFDFC]">
                {number}
              </span>

              <div className="min-w-0">
                <h3 className="kk-process-step-title font-serif text-xl font-bold leading-6 text-[#17191C] min-[421px]:mt-5">
                  {title}
                </h3>
                <p className="kk-process-step-description mt-2 text-sm leading-6 text-[#6F6F70]">
                  {description}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default Nutrition;
