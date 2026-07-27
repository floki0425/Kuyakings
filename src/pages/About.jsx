import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SEO from "../components/seo/SEO";
import IllustratedPanel from "../components/common/IllustratedPanel";
import Reveal from "../components/common/Reveal";
import { breadcrumbJsonLd, seo } from "../lib/seo";
import { useSitePhotoSlots } from "../lib/useSitePhotoSlots";

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

const values = [
  {
    title: "Premium-Quality Beef",
    text: "Sourced from select farms, tender and dependable in every jar.",
    icon: <BeefIcon />,
  },
  {
    title: "Our Signature Marinade",
    text: "A carefully balanced recipe crafted by Kuya King's, built on flavor, not shortcuts.",
    icon: <MarinadeIcon />,
  },
  {
    title: "Prepared in Small Batches",
    text: "Made with patience so each batch meets the same high standard, every time.",
    icon: <BatchIcon />,
  },
  {
    title: "Made for Any Meal",
    text: "Perfect with rice, breakfast, pinoy-style lunches, or a midnight craving.",
    icon: <MealIcon />,
  },
];

function About() {
  const photos = useSitePhotoSlots();

  return (
    <main className="min-h-screen kk-bg-plain text-[#17191C]">
      <SEO
        title={seo.aboutTitle}
        description={seo.aboutDescription}
        path="/about"
        jsonLd={({ canonicalUrl }) =>
          breadcrumbJsonLd([
            { name: "Home", url: canonicalUrl.replace(/\/about$/, "/") },
            { name: "About", url: canonicalUrl },
          ])
        }
      />
      <Header />

      <section className="px-5 py-14 min-[421px]:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-14 min-[421px]:space-y-16 lg:space-y-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="kk-fade-in">
              <p className="text-xs font-black uppercase tracking-widest text-[#C91F3A]">
                Our Story
              </p>

              <h1 className="mt-3 max-w-xl font-serif text-4xl font-bold leading-[1.02] text-[#17191C] min-[421px]:text-5xl">
                Born During the Pandemic, Built with Passion
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-[#5F5B58]">
               Kuya King's began during the height of the pandemic, when many people turned to their passions for comfort and purpose. What started as a simple hobby in our home kitchen soon became something much bigger. Sharing our homemade dishes with friends and family through Facebook and Instagram, we were overwhelmed by the support and encouragement we received.

              </p>

             

              
            </div>

            <IllustratedPanel
              icon={<MarinadeIcon />}
              caption="Family Recipe"
              label="Passed down with love"
              imageUrl={photos["about-2"]}
              imageAlt="Kuya King's Beef Tapa family recipe"
              className="kk-fade-in aspect-[4/3] w-full rounded-lg"
              style={{ animationDelay: "120ms" }}
            />
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <IllustratedPanel
              icon={<BatchIcon />}
              caption="Homemade Goodness"
              label="From our kitchen"
              imageUrl={photos.about}
              imageAlt="Kuya King's Beef Tapa being prepared and packed"
              className="kk-fade-in order-2 aspect-[4/3] w-full rounded-lg lg:order-1"
            />

            <div className="kk-fade-in order-1 lg:order-2">
              <p className="max-w-lg text-base leading-7 text-[#5F5B58]">
                At the heart of Kuya King&apos;s is a family recipe passed
                down by our parents, a recipe rooted in love, tradition, and
                home-cooked goodness. Long before the business started, this
                special beef tapa was already a favorite among my high school
                classmates. Whenever I brought it as packed lunch, it would
                quickly become the most requested meal at the table. Years
                later, many of those same friends still ask for it and crave
                the familiar taste they grew up enjoying.
              </p>
            </div>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="kk-fade-in">
              <p className="max-w-lg text-base leading-7 text-[#5F5B58]">
                Inspired by these memories and the positive response from our
                growing community, we decided to turn our passion into a
                business. Today, Kuya King&apos;s continues to serve the same
                homemade flavors that brought people together during
                challenging times, proving that the best recipes are not just
                about food, but about the stories, connections, and memories
                they create.
              </p>

               

              <Link
                to="/order"
                className="mt-7 inline-flex items-center justify-center rounded-xl bg-[#c91f3a] px-6 py-3 text-sm font-black text-white transition hover:opacity-90"
              >
                Order Now
              </Link>
            </div>

            <IllustratedPanel
              icon={<MealIcon />}
              caption="Humble Beginnings"
              label="Where it all started"
              imageUrl={photos["about-3"]}
              imageAlt="Kuya King's Beef Tapa homemade beginnings"
              className="kk-fade-in aspect-[4/3] w-full rounded-lg"
            />
          </div>
             <p className="text-xs font-black uppercase tracking-widest text-[#C91F3A] mt-50 text-center">
                From our family's kitchen to your table, Kuya King's is a taste of home in every bite. 🍴❤️
              </p>
        </div>
      </section>

      <section className="border-t border-[#E8E1DE] kk-bg-blush px-5 py-14 min-[421px]:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal as="div" className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-widest text-[#C91F3A]">
              What We Stand For
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-[1.05] text-[#17191C] min-[421px]:text-4xl">
              The same standard, every single jar.
            </h2>
          </Reveal>

          <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
            {values.map((item, index) => (
              <Reveal
                key={item.title}
                delay={index * 90}
                className="flex gap-4 rounded-lg border border-[#E8E1DE] bg-white p-5"
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[#c91f3a]/30 bg-[#F8E6E4] text-[#c91f3a] [&_svg]:h-5 [&_svg]:w-5 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.5]">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-[#17191C]">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#5F5B58]">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default About;
