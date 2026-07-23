import Reveal from "../common/Reveal";

function StarIcon({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`h-4 w-4 ${filled ? "fill-[#c91f3a] stroke-[#c91f3a]" : "fill-none stroke-[#D9D0CB]"}`}
      strokeWidth="1.4"
    >
      <path
        d="m12 4 2.4 5.1 5.6.7-4.1 3.9 1 5.6-4.9-2.7-4.9 2.7 1-5.6-4.1-3.9 5.6-.7Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AvatarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[1.6]">
      <circle cx="12" cy="8.5" r="3.4" />
      <path d="M5.5 19.5c1.4-3.3 4-4.8 6.5-4.8s5.1 1.5 6.5 4.8" strokeLinecap="round" />
    </svg>
  );
}

const reviews = [
  {
    name: "Customer Name",
    location: "Metro Manila",
    quote:
      "[Sample review — replace with a real customer quote about taste, freshness, or delivery experience.]",
  },
  {
    name: "Customer Name",
    location: "Metro Manila",
    quote:
      "[Sample review — swap in real feedback from Facebook, Messenger, or a repeat customer.]",
  },
  {
    name: "Customer Name",
    location: "Metro Manila",
    quote:
      "[Sample review — replace before sharing this page publicly.]",
  },
];

function Reviews() {
  return (
    <section
      id="reviews"
      className="kk-reviews kk-bg-plain px-5 py-14 min-[421px]:py-20 lg:py-24"
    >
      <Reveal as="div" className="kk-reviews-header mx-auto max-w-2xl text-center">
        <p className="kk-reviews-eyebrow text-xs font-black uppercase tracking-widest text-[#C91F3A]">
          Customer love
        </p>

        <h2 className="kk-reviews-heading mt-3 font-serif text-3xl font-bold leading-[1.05] text-[#17191C] min-[421px]:text-4xl">
          What Our Customers Say
        </h2>

        <p className="kk-reviews-copy mt-4 text-sm leading-6 text-[#5F5B58] min-[421px]:text-base">
          Real feedback from the people who&apos;ve tried Kuya King&apos;s
          Beef Tapa.
        </p>

        <p className="mx-auto mt-4 inline-flex rounded-full border border-dashed border-[#D9D0CB] px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-wide text-[#8a8580]">
          Sample content — replace with real reviews before launch
        </p>
      </Reveal>

      <div className="kk-reviews-grid mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review, index) => (
          <Reveal
            key={index}
            delay={index * 90}
            className="kk-reviews-item flex flex-col rounded-lg border border-[#E8E1DE] bg-white p-6"
          >
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <StarIcon key={starIndex} filled />
              ))}
            </div>

            <p className="mt-4 flex-1 font-serif text-base italic leading-6 text-[#3a3a3c]">
              &ldquo;{review.quote}&rdquo;
            </p>

            <div className="mt-5 flex items-center gap-3 border-t border-[#E8E1DE] pt-4">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#F8E6E4] text-[#c91f3a]">
                <AvatarIcon />
              </span>
              <div>
                <p className="text-sm font-black text-[#17191C]">{review.name}</p>
                <p className="text-xs text-[#8a8580]">{review.location}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default Reviews;
