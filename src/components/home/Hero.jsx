import { Link } from "react-router-dom"
import { brand, product } from "../../lib/constants"


const Hero = () => {
  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[1.1fr_0.9fr_0.75fr] lg:items-center lg:py-16">
      <div>
        <p className="mb-4 inline-flex rounded-full bg-[#DDE8D2] px-4 py-2 text-sm font-black text-[#25382B]">
          {product.protein} Protein • {product.calories} Calories • {product.packSize} Pack
        </p>

        <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-[#25382B] sm:text-6xl lg:text-7xl">
          Crunch. <br />
          Fuel. <br />
          Grind.
        </h1>

        <p className="mt-5 text-lg font-bold text-[#D96C2C]">
          {brand.tagline}
        </p>

        <p className="mt-5 max-w-xl text-base leading-7 text-[#3F3F3F]">
          Crunchy, tasty, and packed with {product.protein} protein per pack.
          A smarter snack choice for gym-goers, busy people, and anyone who
          wants a better alternative to regular chips.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/order"
            className="rounded-full bg-[#D96C2C] px-7 py-3 text-center font-black text-white shadow-sm transition hover:opacity-90"
          >
            Order Now
          </Link>

          <a
            href="#flavors"
            className="rounded-full border border-[#25382B] px-7 py-3 text-center font-black text-[#25382B]"
          >
            View Flavors
          </a>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {["High Protein", "Low Fat", "7 Flavors"].map((item) => (
            <div key={item} className="rounded-2xl border border-[#D8D0C3] bg-white p-4 text-center">
              <p className="text-sm font-black text-[#25382B]">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] border border-[#D8D0C3] bg-white p-6 shadow-sm">
        <div className="flex aspect-square items-center justify-center rounded-[1.5rem] bg-[#DDE8D2] p-6">
          <img
            
            alt="Pure Grind Protein Chips"
            className="max-h-full object-contain drop-shadow-xl"
          />
        </div>
      </div>

      <div className="rounded-[2rem] border border-[#D8D0C3] bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-widest text-[#D96C2C]">
          Product Price
        </p>

        <h2 className="mt-3 text-3xl font-black text-[#25382B]">
          ₱{brand.pricePerPack}
        </h2>
        <p className="text-sm text-[#555]">per pack</p>

        <div className="mt-6 space-y-4">
          {[
            `${product.protein} protein per pack`,
            `${product.calories} calories only`,
            `${product.packSize} per pack`,
            `${product.flavors.length} flavors available`,
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DDE8D2] text-sm font-black text-[#25382B]">
                ✓
              </span>
              <p className="text-sm font-semibold text-[#2B2B2B]">{item}</p>
            </div>
          ))}
        </div>

        <Link
          to="/order"
          className="mt-7 block rounded-full bg-[#25382B] px-6 py-3 text-center font-black text-white transition hover:opacity-90"
        >
          Order Now
        </Link>
      </div>
    </section>
  )
}

export default Hero
