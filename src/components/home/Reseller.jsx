import { brand } from "../../lib/constants";
import Reveal from "../common/Reveal";

function StorefrontIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9.5 5.5 4h13L20 9.5" />
      <path d="M4 9.5v9a1.5 1.5 0 0 0 1.5 1.5H10v-5h4v5h4.5a1.5 1.5 0 0 0 1.5-1.5v-9" />
      <path d="M4 9.5h16" />
    </svg>
  );
}

function GrowthIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m4 16 5.5-5.5 4 4L20 7.5" />
      <path d="M15 7.5h5V12.5" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 13a8 8 0 0 1 16 0" />
      <rect x="3.5" y="13" width="4" height="6" rx="1.5" />
      <rect x="16.5" y="13" width="4" height="6" rx="1.5" />
      <path d="M20.5 19v1a3 3 0 0 1-3 3h-3" />
    </svg>
  );
}

const highlights = [
  {
    title: "Trusted Homemade Brand",
    text: "Backed by real customers who keep coming back for more.",
    icon: <StorefrontIcon />,
  },
  {
    title: "Easy to Get Started",
    text: "Message us and we'll walk you through how reselling works.",
    icon: <GrowthIcon />,
  },
  {
    title: "Support Along the Way",
    text: "We're here to help as you grow your reseller business.",
    icon: <SupportIcon />,
  },
];

function Reseller() {
  return (
    <section
      id="reseller"
      className="kk-reseller kk-bg-blush px-5 py-14 min-[421px]:py-20 lg:py-24"
    >
      <Reveal as="div" className="kk-reseller-header mx-auto max-w-2xl text-center">
        <p className="kk-reseller-eyebrow text-xs font-black uppercase tracking-widest text-[#C91F3A]">
          Partner With Us
        </p>

        <h2 className="kk-reseller-heading mt-3 font-serif text-3xl font-bold leading-[1.05] text-[#17191C] min-[421px]:text-4xl">
          Become a Kuya King&apos;s Reseller
        </h2>

        <p className="kk-reseller-copy mt-4 text-sm leading-6 text-[#5F5B58] min-[421px]:text-base">
          Love what we make? Bring Kuya King&apos;s homemade Beef Tapa to
          your own community and grow a business around a brand people
          already trust.
        </p>
      </Reveal>

      <div className="kk-reseller-highlights mx-auto mt-10 grid max-w-4xl gap-8 sm:grid-cols-3">
        {highlights.map((item, index) => (
          <Reveal
            key={item.title}
            delay={index * 90}
            className="kk-reseller-highlight flex flex-col items-center text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#c91f3a]/30 bg-[#F8E6E4] text-[#c91f3a] [&_svg]:h-5 [&_svg]:w-5 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.5]">
              {item.icon}
            </div>
            <h3 className="mt-3 text-sm font-black leading-5 text-[#17191C]">
              {item.title}
            </h3>
            <p className="mt-1.5 text-xs leading-5 text-[#6F6F70]">
              {item.text}
            </p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={180} as="div" className="mt-10 text-center">
        <a
          href={brand.messengerLink}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center justify-center rounded-xl bg-[#c91f3a] px-6 py-3 text-sm font-black text-white transition hover:opacity-90"
        >
          Message Us to Apply
        </a>
      </Reveal>
    </section>
  );
}

export default Reseller;
