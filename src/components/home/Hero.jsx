import { Link } from "react-router-dom"
import { brand, product } from "../../lib/constants"
import productImage from "../../assets/product.png";
import bgChips from "../../assets/bg.png";
const Hero = () => {
  return (
     <section
      className="relative overflow-hidden bg-cover bg-center px-5 py-22"
      style={{ backgroundImage: `url(${bgChips})` }}
    >
      <div className="absolute inset-0 bg-[#F8F1E7]/20"></div>

      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
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

        <div className="relative flex items-center justify-center lg:min-h-[620px]">
          {/* soft glow behind product */}
          <div className="absolute h-[360px] w-[360px] rounded-full bg-[#DDE8D2]/70 blur-3xl md:h-[480px] md:w-[480px]" />

          {/* floating background rings */}
          <div className="absolute h-[420px] w-[420px] rounded-full border border-white/50 md:h-[560px] md:w-[560px]" />
          <div className="absolute h-[300px] w-[300px] rounded-full border border-[#D96C2C]/20 md:h-[430px] md:w-[430px]" />

          {/* 3D product wrapper */}
          <div className="product-float relative z-10">
            <div className="relative">
              <img
                src={productImage}
                alt="Pure Grind Protein Chips"
                className="relative z-10 mx-auto max-h-130 w-full object-contain drop-shadow-[0_35px_45px_rgba(37,56,43,0.35)] md:max-h-155"
              />

              {/* soft floor shadow */}
              <div className="absolute -bottom-8 left-1/2 h-10 w-64 -translate-x-1/2 rounded-full bg-[#25382B]/25 blur-2xl md:w-80" />
            </div>
          </div>

          {/* floating chips/crumb accents */}
          <div className="absolute right-8 top-20 hidden h-5 w-5 rounded-full bg-[#D96C2C] shadow-lg md:block" />
          <div className="absolute bottom-28 left-10 hidden h-4 w-4 rotate-45 rounded-sm bg-[#D96C2C]/70 shadow-lg md:block" />
          <div className="absolute right-20 bottom-20 hidden h-3 w-3 rounded-full bg-[#25382B]/70 md:block" />
        </div>

     
      </div>
    </section>



  )
}

export default Hero
