import Header from "../components/layout/Header"
import Hero from "../components/home/Hero"
import Benefits from "../components/home/Benefits"
import PerfectPair from "../components/home/PerfectPair"
import Nutrition from "../components/home/Nutrition"
import Flavors from "../components/home/Flavors"
import HowToOrder from "../components/home/HowToOrder"
import Reviews from "../components/home/Reviews"
import CTA from "../components/home/CTA"
import FAQ, { faqs } from "../components/home/FAQ"
import Footer from "../components/layout/Footer"
import SEO from "../components/seo/SEO"
import { businessJsonLd, faqPageJsonLd, seo } from "../lib/seo"

const Home = () => {
  return (
    <main className="min-h-screen kk-bg-blush text-[#171717]">
      <SEO
        title={seo.homeTitle}
        description={seo.homeDescription}
        path="/"
        jsonLd={(context) => [...businessJsonLd(context), faqPageJsonLd(faqs)]}
      />
      <Header />
      <Hero />
      <Benefits />
      <PerfectPair />
      <Flavors />

      <HowToOrder />

      <Nutrition />
      <Reviews />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}

export default Home
