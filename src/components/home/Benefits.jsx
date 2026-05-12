function Benefits() {
  const benefits = [
    {
      title: "High Protein",
      text: "Each pack contains 25g protein to support your fitness goals.",
      icon: "💪",
    },
    {
      title: "Low Fat Snack",
      text: "Only 5.8g fat per pack, a better snack option than regular chips.",
      icon: "🔥",
    },
    {
      title: "Fitness-Friendly",
      text: "Good for gym-goers, busy people, and macro-conscious snackers.",
      icon: "🏋️",
    },
    {
      title: "Convenient & Tasty",
      text: "Easy to bring, easy to eat, and available in multiple flavors.",
      icon: "🥨",
    },
  ];

  return (
    <section id="benefits" className="mx-auto max-w-7xl px-5 py-14">
      <div className="text-center">
        <h2 className="text-3xl font-black text-[#25382B] md:text-4xl">
          Clean Nutrition. Real Crunch.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-[#555]">
          Made for people who want a smarter snack option without sacrificing taste.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="rounded-[1.5rem] border border-[#D8D0C3] bg-white p-6 shadow-sm"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#DDE8D2] text-2xl">
              {benefit.icon}
            </div>
            <h3 className="mt-5 font-black text-[#25382B]">{benefit.title}</h3>
            <p className="mt-3 text-sm leading-6 text-[#555]">{benefit.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Benefits;