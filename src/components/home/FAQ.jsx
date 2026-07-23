import { useState } from "react";
import Reveal from "../common/Reveal";

export const faqs = [
  ["What is Kuya King's Beef Tapa made with?", "It is made with pure beef and a homemade-style marinade."],
  ["Is it ready to eat?", "It is prepared for convenient cooking and serving with your favorite meal."],
  ["How much is one jar?", "Original is ₱300 and Spicy is ₱310. A 3-jar Bundle (any flavor mix) is ₱900."],
  ["What products are available?", "Availability depends on the current product list shown on the order form."],
  ["Where do you deliver?", "Currently, Metro Manila is covered."],
  ["What payment methods are accepted?", "GCash, Maya, bank transfer, and COD."],
];

function PlusIcon({ isOpen }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`h-4 w-4 flex-shrink-0 fill-none stroke-current stroke-[2] transition-transform duration-300 ${
        isOpen ? "rotate-45" : ""
      }`}
    >
      <path d="M12 4v16" strokeLinecap="round" />
      <path d="M4 12h16" strokeLinecap="round" />
    </svg>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      className="kk-faq kk-bg-plain px-5 py-14 min-[421px]:py-20 lg:py-24"
    >
      <Reveal as="div" className="kk-faq-header mx-auto max-w-2xl text-center">
        <p className="kk-faq-eyebrow text-xs font-black uppercase tracking-widest text-[#C91F3A]">
          Got questions?
        </p>

        <h2 className="kk-faq-heading mt-3 font-serif text-3xl font-bold leading-[1.05] text-[#17191C] min-[421px]:text-4xl">
          Frequently Asked Questions
        </h2>

        <p className="kk-faq-copy mt-4 text-sm leading-6 text-[#5F5B58] min-[421px]:text-base">
          Everything you need to know before your first order. Still
          curious? Message us on Facebook anytime.
        </p>
      </Reveal>

      <div className="kk-faq-list mx-auto mt-10 max-w-3xl divide-y divide-[#E8E1DE] border-t border-b border-[#E8E1DE]">
        {faqs.map(([question, answer], index) => {
          const isOpen = openIndex === index;

          return (
            <Reveal
              key={question}
              delay={Math.min(index * 60, 300)}
              className="kk-faq-item"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                aria-expanded={isOpen}
                className="kk-faq-question flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-serif text-base font-bold text-[#17191C] min-[421px]:text-lg">
                  {question}
                </span>
                <span
                  className={`kk-faq-toggle flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                    isOpen
                      ? "border-[#c91f3a] text-[#c91f3a]"
                      : "border-[#E8E1DE] text-[#8a8580]"
                  }`}
                >
                  <PlusIcon isOpen={isOpen} />
                </span>
              </button>

              <div
                className={`kk-faq-answer grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="min-h-0">
                  <p className="pb-5 pr-10 text-sm leading-6 text-[#5F5B58]">
                    {answer}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export default FAQ;
