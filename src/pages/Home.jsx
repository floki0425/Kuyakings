import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Hero from "../components/home/Hero";
import Benefits from "../components/home/Benefits";
import Nutrition from "../components/home/Nutrition";
import Flavors from "../components/home/Flavors";
import FAQ from "../components/home/FAQ";
import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="min-h-screen bg-[#F8F1E7] text-[#2B2B2B]">
      <Header />
      <Hero />
      <Benefits />
      <Nutrition />
      <Flavors />

      <section id="how-to-order" className="mx-auto max-w-7xl px-5 py-14">
        <div className="text-center">
          <h2 className="text-3xl font-black text-[#25382B] md:text-4xl">
            How to Order
          </h2>
          <p className="mt-3 text-[#555]">
            Get your Pure Grind Protein Chips in 3 simple steps.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            ["1", "Choose Your Flavor", "Pick from 7 available flavors."],
            ["2", "Place Your Order", "Fill out the order form with your details."],
            ["3", "Wait for Confirmation", "Owner will confirm payment and delivery details."],
          ].map(([num, title, text]) => (
            <div key={num} className="rounded-[1.5rem] border border-[#D8D0C3] bg-white p-6 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#25382B] font-black text-white">
                {num}
              </div>
              <h3 className="mt-5 font-black text-[#25382B]">{title}</h3>
              <p className="mt-3 text-sm text-[#555]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="rounded-[2rem] bg-[#D96C2C] p-8 text-center text-white md:p-12">
          <h2 className="text-3xl font-black md:text-4xl">
            Ready to Fuel Your Grind?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Order Pure Grind Protein Chips today and enjoy a high-protein snack
            that fits your lifestyle.
          </p>

          <Link
            to="/order"
            className="mt-7 inline-flex rounded-full bg-white px-7 py-3 font-black text-[#D96C2C]"
          >
            Order Now
          </Link>
        </div>
      </section>

      <FAQ />
      <Footer />
    </main>
  );
}

export default Home;