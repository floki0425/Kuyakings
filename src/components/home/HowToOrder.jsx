import { Link } from "react-router-dom";
import Reveal from "../common/Reveal";

const steps = [
  {
    number: "01",
    title: "Choose Your Product",
    text: "Pick from the available Kuya King's flavors or the 3-jar bundle.",
  },
  {
    number: "02",
    title: "Place Your Order",
    text: "Fill out the order form with your delivery and payment details.",
  },
  {
    number: "03",
    title: "Wait for Confirmation",
    text: "Owner will confirm your payment and delivery schedule.",
  },
];

function HowToOrder() {
  return (
    <section
      id="how-to-order"
      className="kk-how bg-[#FFF7F2] px-5 py-14 min-[421px]:py-20 lg:py-24"
    >
      <Reveal as="div" className="kk-how-header mx-auto max-w-2xl text-center">
        <p className="kk-how-eyebrow text-xs font-black uppercase tracking-widest text-[#C91F3A]">
          Seamless ordering
        </p>

        <h2 className="kk-how-heading mt-3 font-serif text-3xl font-bold leading-[1.05] text-[#17191C] min-[421px]:text-4xl">
          How to Order
        </h2>

        <p className="kk-how-copy mt-4 text-sm leading-6 text-[#5F5B58] min-[421px]:text-base">
          Get your Kuya King&apos;s Beef Tapa delivered in 3 simple steps.
        </p>
      </Reveal>

      <div className="kk-how-timeline relative mx-auto mt-12 grid max-w-4xl gap-10 min-[421px]:grid-cols-3 min-[421px]:gap-6">
        <span
          aria-hidden="true"
          className="absolute left-[16.5%] right-[16.5%] top-6 hidden h-px bg-[#D9D0CB] min-[421px]:block"
        />

        {steps.map((step, index) => (
          <Reveal
            key={step.number}
            delay={index * 120}
            className={`kk-how-step relative flex gap-4 text-left min-[421px]:flex-col min-[421px]:items-center min-[421px]:text-center ${
              index < steps.length - 1
                ? "after:absolute after:bottom-[-1.75rem] after:left-6 after:top-[3.25rem] after:w-px after:bg-[#D9D0CB] after:content-[''] min-[421px]:after:hidden"
                : ""
            }`}
          >
            <span className="kk-how-step-number relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-[#c91f3a]/35 bg-[#FFF7F2] text-base font-black text-[#c91f3a] shadow-[0_0_0_8px_#FFF7F2]">
              {step.number}
            </span>

            <div className="min-w-0">
              <h3 className="kk-how-step-title font-serif text-lg font-bold leading-6 text-[#17191C] min-[421px]:mt-5">
                {step.title}
              </h3>
              <p className="kk-how-step-text mt-2 text-sm leading-6 text-[#6F6F70]">
                {step.text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Link
          to="/order"
          className="kk-how-cta inline-flex items-center justify-center rounded-full bg-[#c91f3a] px-7 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#a61930]"
        >
          Order Now
        </Link>
      </div>
    </section>
  );
}

export default HowToOrder;
