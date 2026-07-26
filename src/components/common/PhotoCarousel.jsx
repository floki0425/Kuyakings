import { useEffect, useRef, useState } from "react";

function ArrowIcon({ direction = "next" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[2]"
      style={{ transform: direction === "prev" ? "scaleX(-1)" : undefined }}
    >
      <path d="M4 12h16" strokeLinecap="round" />
      <path d="m13 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhotoCarousel({
  photos,
  autoplay = true,
  interval = 5000,
  className = "",
}) {
  const trackRef = useRef(null);
  const activeIndexRef = useRef(0);
  const pausedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const slides = Array.from(track.children);

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries.reduce((best, entry) => {
          if (!best || entry.intersectionRatio > best.intersectionRatio) {
            return entry;
          }
          return best;
        }, null);

        if (mostVisible && mostVisible.intersectionRatio > 0.5) {
          const index = slides.indexOf(mostVisible.target);
          if (index !== -1) setActiveIndex(index);
        }
      },
      { root: track, threshold: [0, 0.5, 1] }
    );

    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [photos.length]);

  useEffect(() => {
    if (!autoplay || photos.length <= 1) return undefined;

    const id = setInterval(() => {
      if (pausedRef.current) return;
      goTo(activeIndexRef.current + 1);
    }, interval);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, interval, photos.length]);

  function goTo(index) {
    const track = trackRef.current;
    if (!track || photos.length === 0) return;

    const nextIndex = ((index % photos.length) + photos.length) % photos.length;
    const target = track.children[nextIndex];
    target?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }

  function pause() {
    pausedRef.current = true;
  }

  function resume() {
    pausedRef.current = false;
  }

  if (photos.length === 0) return null;

  return (
    <div
      className={`kk-carousel relative ${className}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <div
        ref={trackRef}
        className="kk-no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-lg"
      >
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="h-[320px] w-full flex-shrink-0 snap-start snap-always bg-[#FFF7F2] min-[421px]:h-[400px] lg:h-[460px]"
          >
            <img
              src={photo.url}
              alt={photo.alt || "Kuya King's customer photo"}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-contain"
            />
          </div>
        ))}
      </div>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(activeIndexRef.current - 1)}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E8E1DE] bg-white/90 text-[#17191C] shadow-sm transition hover:bg-[#17191C] hover:text-white"
          >
            <ArrowIcon direction="prev" />
          </button>

          <button
            type="button"
            onClick={() => goTo(activeIndexRef.current + 1)}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E8E1DE] bg-white/90 text-[#17191C] shadow-sm transition hover:bg-[#17191C] hover:text-white"
          >
            <ArrowIcon direction="next" />
          </button>

          <div className="mt-4 flex justify-center gap-2">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                type="button"
                aria-label={`Go to photo ${index + 1}`}
                aria-current={index === activeIndex}
                onClick={() => goTo(index)}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex ? "w-6 bg-[#c91f3a]" : "w-2 bg-[#E8E1DE]"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default PhotoCarousel;
