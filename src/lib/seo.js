import { brand, product } from "./constants";

export const seo = {
  homeTitle: "Kuya King's Beef Tapa | Homemade Filipino Beef Tapa",
  homeDescription:
    "Order Kuya King's homemade beef tapa in Metro Manila. Made with pure beef, a special marinade, and small-batch care for everyday Filipino meals.",
  orderTitle: "Order Kuya King's Beef Tapa Online",
  orderDescription:
    "Choose your Kuya King's Beef Tapa product, add delivery details, upload proof of payment, and place your order online.",
  trackTitle: "Track Your Kuya King's Order",
  trackDescription:
    "Track your Kuya King's Beef Tapa order status using your order number and phone number.",
  aboutTitle: "About Kuya King's Beef Tapa",
  aboutDescription:
    "Learn how Kuya King's homemade beef tapa is made — 100% pure beef, a signature marinade, and small-batch care.",
  menuTitle: "Full Menu | Kuya King's Beef Tapa",
  menuDescription:
    "Browse every Kuya King's Beef Tapa flavor and the bundle option, with pricing and nutrition facts.",
  contactTitle: "Contact Kuya King's Beef Tapa",
  contactDescription:
    "Get in touch with Kuya King's Beef Tapa for orders, questions, or delivery concerns.",
  processTitle: "Our Process | Kuya King's Beef Tapa",
  processDescription:
    "See how Kuya King's Beef Tapa is prepared, marinated, packed, and sealed fresh in small batches.",
};

export function businessJsonLd({ canonicalUrl, imageUrl }) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: brand.shortName,
      description: brand.description,
      url: canonicalUrl,
      image: imageUrl,
      telephone: brand.phone,
      areaServed: brand.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Metro Manila",
        addressCountry: "PH",
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: brand.hoursSchema.opens,
        closes: brand.hoursSchema.closes,
      },
      sameAs: [
        brand.facebookLink,
        `https://instagram.com/${brand.instagram}`,
        `https://www.tiktok.com/@${brand.tiktok}`,
      ],
    },
    productJsonLd({ canonicalUrl, imageUrl }),
  ];
}

export function productJsonLd({ canonicalUrl, imageUrl }) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: brand.name,
    description: brand.description,
    image: imageUrl,
    brand: {
      "@type": "Brand",
      name: brand.shortName,
    },
    category: "Filipino food",
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: "PHP",
      price: String(brand.pricePerPack),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Pack size",
        value: product.packSize,
      },
      {
        "@type": "PropertyValue",
        name: "Products",
        value: product.flavors.join(", "),
      },
    ],
  };
}

export function faqPageJsonLd(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
