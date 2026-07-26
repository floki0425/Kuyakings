import Reveal from "../common/Reveal";
import PhotoCarousel from "../common/PhotoCarousel";
import { useReviewPhotos } from "../../lib/useReviewPhotos";

function Reviews() {
  const reviewPhotos = useReviewPhotos();

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
      </Reveal>

      {reviewPhotos.length > 0 && (
        <Reveal
          as="div"
          delay={80}
          className="kk-reviews-carousel mx-auto mt-10 max-w-md"
        >
          <PhotoCarousel photos={reviewPhotos} />
        </Reveal>
      )}
    </section>
  );
}

export default Reviews;
