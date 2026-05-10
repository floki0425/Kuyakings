import { Link } from "react-router-dom";
import { product } from "../../lib/constants";

function Flavors() {
  return (
    <section id="flavors" className="mx-auto max-w-7xl px-5 py-14">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-black text-[#25382B] md:text-4xl">
            Choose Your Flavor
          </h2>
          <p className="mt-3 max-w-2xl text-[#555]">
            Pick your favorite flavor or try different variants.
          </p>
        </div>

        <Link
          to="/order"
          className="rounded-full bg-[#D96C2C] px-6 py-3 text-center font-black text-white"
        >
          Order Your Flavor
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {product.flavors.map((flavor) => (
          <div
            key={flavor}
            className="rounded-2xl border border-[#D8D0C3] bg-white p-5 shadow-sm"
          >
            <p className="font-black text-[#25382B]">{flavor}</p>
            <p className="mt-2 text-sm text-[#555]">Available flavor</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Flavors;