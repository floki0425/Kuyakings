import { product } from "../../lib/constants";

function Nutrition() {
  const items = [
    ["Pack Size", product.packSize],
    ["Protein", product.protein],
    ["Calories", product.calories],
    ["Fat", product.fat],
    ["Carbs", product.carbs],
  ];

  return (
    <section id="nutrition" className="mx-auto max-w-7xl px-5 py-14">
      <div className="rounded-[2rem] bg-[#25382B] p-6 text-white md:p-10">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-black md:text-4xl">
            Packed with Protein. Easy to Track.
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Good for people who track calories and macros. Best consumed as part
            of a balanced diet.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {items.map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white/10 p-5">
              <p className="text-sm text-white/70">{label}</p>
              <p className="mt-2 text-3xl font-black">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Nutrition;