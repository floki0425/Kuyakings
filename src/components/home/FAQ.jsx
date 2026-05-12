function FAQ() {
  const faqs = [
    ["How much protein does each pack have?", "Each 45g pack contains 25g protein."],
    ["How many calories per pack?", "Each pack has 183 calories."],
    ["How much is one pack?", "Each pack is ₱100."],
    ["What flavors are available?", "Plain, Salt N' Pepper, Cheese, Chili BBQ, Sour Cream, Truffle, and Salted Egg."],
    ["Where do you deliver?", "Currently, Metro Manila is covered."],
    ["What payment methods are accepted?", "GCash, Maya, bank transfer, and COD."],
  ];

  return (
    <section id="faq" className="mx-auto max-w-5xl px-5 py-14">
      <div className="text-center">
        <h2 className="text-3xl font-black text-[#25382B] md:text-4xl">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="mt-8 grid gap-4">
        {faqs.map(([question, answer]) => (
          <div
            key={question}
            className="rounded-2xl border border-[#D8D0C3] bg-white p-5 shadow-sm"
          >
            <h3 className="font-black text-[#25382B]">{question}</h3>
            <p className="mt-2 text-sm leading-6 text-[#555]">{answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FAQ;