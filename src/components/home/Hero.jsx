import { Link } from "react-router-dom";
import { useSitePhotoSlots } from "../../lib/useSitePhotoSlots";

const benefits = [
  {
    title: "100% Pure Beef",
    description: "Made with carefully selected quality beef.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 6.5h12" />
        <path d="M8 4.5h8" />
        <path d="M7 9.5c0-2.2 1.8-4 4-4h2c2.2 0 4 1.8 4 4v7c0 2.2-1.8 4-4 4h-2c-2.2 0-4-1.8-4-4v-7Z" />
        <path d="M9.5 13.5h5" />
      </svg>
    ),
  },
  {
    title: "Signature Homemade Recipe",
    description: "Marinated with our own special blend of flavors.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9.5 5.5c.5-1 1.4-1.5 2.5-1.5s2 .5 2.5 1.5" />
        <path d="M4 10.5h16" />
        <path d="M5 10.5c0 3.9 3.1 7 7 7s7-3.1 7-7" />
      </svg>
    ),
  },
  {
    title: "Made with Care",
    description: "Prepared in small batches for quality you can taste.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19.4s-6.4-3.9-8.4-7.6C2.3 9 3.6 6 6.5 6c1.8 0 3.2 1.1 3.9 2.4C11.1 7.1 12.5 6 14.3 6c2.9 0 4.2 3 3 5.8-2 3.7-8.4 7.6-8.4 7.6Z" />
      </svg>
    ),
  },
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="kk-hero-arrow">
      <path d="M4 12h16" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function JarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="kk-hero-jar-icon-svg">
      <path d="M4 8.5 6.5 5h11L20 8.5" />
      <rect x="4" y="8.5" width="16" height="2.2" rx="0.6" />
      <path d="m8.5 19.5-1-8h9l-1 8a2 2 0 0 1-2 1.8h-3a2 2 0 0 1-2-1.8Z" />
    </svg>
  );
}

const Hero = () => {
  const photos = useSitePhotoSlots();

  return (
    <section className="kk-hero relative overflow-hidden px-5 py-16 sm:py-20 lg:py-24">
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="kk-hero-grid grid items-center gap-8 lg:gap-12">
          <div className="kk-hero-copy kk-fade-in">
            <p className="kk-hero-eyebrow">Made the Kuya King&apos;s way</p>

            <h1 className="kk-hero-heading">
              <span>Homemade</span>
              <span>Beef Tapa.</span>
              <span className="kk-hero-heading-accent">Made to Crave.</span>
            </h1>

            <p className="kk-hero-supporting">
              Tender cuts of 100% pure beef, marinated in our signature
              homemade recipe and prepared with the rich, comforting flavor
              you&apos;ll want on your plate again and again.
            </p>

            <div className="kk-hero-benefits">
              {benefits.map((item) => (
                <div key={item.title} className="kk-hero-benefit">
                  <div className="kk-hero-icon" aria-hidden="true">
                    {item.icon}
                  </div>
                  <div>
                    <p className="kk-hero-benefit-title">{item.title}</p>
                    <p className="kk-hero-benefit-copy">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="kk-hero-actions">
              <Link to="/order" className="kk-hero-cta-primary">
                Order Now
                <ArrowIcon />
              </Link>
              <a href="#flavors" className="kk-hero-cta-secondary">
                Explore Best Sellers
              </a>
            </div>
          </div>

          <figure
            className="kk-hero-media kk-fade-in"
            style={{ animationDelay: "120ms" }}
            aria-label="Kuya King's Beef Tapa jar"
          >
            {photos.hero ? (
              <img
                src={photos.hero}
                alt="Kuya King's Beef Tapa"
                className="kk-hero-media-photo"
              />
            ) : (
              <>
                <div className="kk-hero-jar kk-float">
                  <div className="kk-hero-jar-lid" />
                  <div className="kk-hero-jar-body">
                    <span className="kk-hero-jar-badge">Original</span>
                    <div className="kk-hero-jar-label">
                      <div className="kk-hero-jar-icon">
                        <JarIcon />
                      </div>
                      <p className="kk-hero-jar-title">Beef Tapa</p>
                      <p className="kk-hero-jar-caption">Homemade &bull; 100% Pure Beef</p>
                    </div>
                  </div>
                </div>
                <div className="kk-hero-media-cloth" aria-hidden="true" />
              </>
            )}
          </figure>
        </div>
      </div>
    </section>
  );
};

export default Hero;
