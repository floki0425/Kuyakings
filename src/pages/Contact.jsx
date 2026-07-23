import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SEO from "../components/seo/SEO";
import Reveal from "../components/common/Reveal";
import { brand } from "../lib/constants";
import { breadcrumbJsonLd, seo } from "../lib/seo";
import { submitContactMessage } from "../lib/api";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.5 4h3l1.5 4-2 1.5a10 10 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2C10.8 19 5 13.2 4.5 6.2A2 2 0 0 1 6.5 4Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.5 8.5h2V5.3c-.35-.05-1.54-.15-2.94-.15-2.9 0-4.9 1.77-4.9 5.02v2.63H6v3.6h3.16V21h3.7v-4.6h3.03l.48-3.6h-3.51v-2.3c0-1.04.28-1.75 1.79-1.75Z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s-6.5-5.9-6.5-11a6.5 6.5 0 0 1 13 0c0 5.1-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.5l3 2" />
    </svg>
  );
}

const contactPoints = [
  {
    title: "Call or Text",
    value: brand.phone,
    href: `tel:${brand.phone}`,
    icon: <PhoneIcon />,
  },
  {
    title: "Message on Facebook",
    value: brand.facebook,
    href: brand.facebookLink,
    icon: <FacebookIcon />,
    external: true,
  },
  {
    title: "Delivery Area",
    value: brand.location,
    icon: <LocationIcon />,
  },
  {
    title: "Business Hours",
    value: brand.hours,
    icon: <ClockIcon />,
  },
];

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  function updateField(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(null);

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const message = formData.message.trim();

    if (!name || !message) {
      setStatus({ type: "error", text: "Please enter your name and a message." });
      return;
    }

    if (!email && !phone) {
      setStatus({
        type: "error",
        text: "Please leave an email or phone number so we can reply.",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await submitContactMessage({
        name,
        email: email || null,
        phone: phone || null,
        message,
      });

      if (error) {
        setStatus({ type: "error", text: `Something went wrong: ${error.message}` });
        return;
      }

      setStatus({
        type: "success",
        text: "Message sent! We'll get back to you soon.",
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", text: `Something went wrong: ${err.message}` });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-10 grid max-w-2xl gap-4 rounded-lg border border-[#E8E1DE] bg-white p-6 sm:p-8"
    >
      <div className="text-center">
        <h2 className="font-serif text-2xl font-bold text-[#17191C]">
          Send Us a Message
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-[#5F5B58]">
          Prefer writing it out? Fill this in and we&apos;ll get back to you.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="text-xs font-black uppercase tracking-wide text-[#8a8580]"
          >
            Name
          </label>
          <input
            id="contact-name"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Your full name"
            className="kk-input mt-1.5"
          />
        </div>

        <div>
          <label
            htmlFor="contact-phone"
            className="text-xs font-black uppercase tracking-wide text-[#8a8580]"
          >
            Phone (optional)
          </label>
          <input
            id="contact-phone"
            value={formData.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="09XX XXX XXXX"
            className="kk-input mt-1.5"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="text-xs font-black uppercase tracking-wide text-[#8a8580]"
        >
          Email (optional)
        </label>
        <input
          id="contact-email"
          type="email"
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          placeholder="you@email.com"
          className="kk-input mt-1.5"
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="text-xs font-black uppercase tracking-wide text-[#8a8580]"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          value={formData.message}
          onChange={(e) => updateField("message", e.target.value)}
          placeholder="How can we help?"
          rows={5}
          className="kk-input mt-1.5 resize-none"
        />
      </div>

      <p className="text-xs leading-5 text-[#8a8580]">
        Leave at least an email or phone number so we know how to reply.
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 inline-flex items-center justify-center rounded-full bg-[#c91f3a] px-6 py-3 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>

      {status && (
        <p
          className={`rounded-[0.85rem] p-3 text-sm font-bold ${
            status.type === "error"
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-800"
          }`}
        >
          {status.text}
        </p>
      )}
    </form>
  );
}

function Contact() {
  return (
    <main className="min-h-screen kk-bg-plain text-[#17191C]">
      <SEO
        title={seo.contactTitle}
        description={seo.contactDescription}
        path="/contact"
        jsonLd={({ canonicalUrl }) =>
          breadcrumbJsonLd([
            { name: "Home", url: canonicalUrl.replace(/\/contact$/, "/") },
            { name: "Contact", url: canonicalUrl },
          ])
        }
      />
      <Header />

      <section className="px-5 py-14 min-[421px]:py-20 lg:py-24">
        <div className="kk-fade-in mx-auto max-w-2xl text-center">
          <p className="text-xs font-black uppercase tracking-widest text-[#C91F3A]">
            Contact Us
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold leading-[1.05] text-[#17191C] min-[421px]:text-5xl">
            We&apos;d Love to Hear From You.
          </h1>

          <p className="mt-4 text-base leading-7 text-[#5F5B58]">
            Questions about an order, delivery, or just want to say hi?
            Reach Kuya King&apos;s through any of the channels below.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {contactPoints.map((item, index) => {
            const Wrapper = item.href ? "a" : "div";
            const wrapperProps = item.href
              ? {
                  href: item.href,
                  ...(item.external
                    ? { target: "_blank", rel: "noreferrer noopener" }
                    : {}),
                }
              : {};

            return (
              <Reveal
                key={item.title}
                as={Wrapper}
                delay={index * 90}
                {...wrapperProps}
                className={`rounded-lg border border-[#E8E1DE] bg-white p-6 text-center transition ${
                  item.href ? "hover:border-[#c91f3a]/40 hover:shadow-[0_18px_36px_rgba(151,23,44,0.1)]" : ""
                }`}
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#c91f3a]/30 bg-[#F8E6E4] text-[#c91f3a] [&_svg]:h-5 [&_svg]:w-5 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.5]">
                  {item.icon}
                </div>
                <p className="mt-4 text-xs font-black uppercase tracking-widest text-[#8a8580]">
                  {item.title}
                </p>
                <p className="mt-2 font-black text-[#17191C]">{item.value}</p>
              </Reveal>
            );
          })}
        </div>

        <ContactForm />

        <Reveal
          delay={280}
          className="mx-auto mt-10 flex max-w-5xl flex-col items-center gap-3 rounded-lg border border-[#E8E1DE] bg-[#FFF7F2] p-6 text-center sm:flex-row sm:justify-between sm:text-left"
        >
          <div>
            <p className="font-black text-[#17191C]">Already placed an order?</p>
            <p className="mt-1 text-sm text-[#5F5B58]">
              Track your order status using your order number and phone number.
            </p>
          </div>

          <Link
            to="/track-order"
            className="inline-flex flex-shrink-0 items-center justify-center rounded-full border border-[#17191C] px-6 py-3 text-sm font-black text-[#17191C] transition hover:bg-[#17191C] hover:text-white"
          >
            Track Order
          </Link>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}

export default Contact;
