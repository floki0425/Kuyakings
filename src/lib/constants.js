export const brand = {
  name: "Kuya King's Beef Tapa",
  shortName: "Kuya King's",
  tagline: "Homemade Beef Tapa Like No Other.",
  description:
    "Homemade beef tapa made with pure beef, a special marinade, and small-batch flavor. Order Kuya King's Beef Tapa online in Metro Manila.",
  siteUrl: "https://www.kuyakings.com",
  location: "Metro Manila, Philippines",
  hours: "8:00 AM – 10:00 PM, Daily",
  hoursSchema: { opens: "08:00", closes: "22:00" },
  keywords: [
    "Kuya King's",
    "Kuya Kings",
    "beef tapa",
    "homemade beef tapa",
    "Filipino beef tapa",
    "Metro Manila beef tapa",
    "beef tapa delivery",
  ],
  pricePerPack: 300, // starting price; per-flavor pricing is managed in Supabase product_flavors
  profitRate: 0.4,
  phone: "09364053573",
  facebook: "Kuya King's",
  facebookLink: "https://www.facebook.com/KuyaKingsPasta",
  instagram: "kuyakingspasta",
  tiktok: "kuyakings",
  messenger: "Kuya King's",
  messengerLink: "https://m.me/KuyaKingsPasta",
};

export const photoUpload = {
  bucket: "site-photos",
  folder: "kuya-kings",
};

export const product = {
  packSize: "250ml jar",
  protein: "25g",
  calories: "183",
  fat: "5.8g",
  carbs: "12g",
  flavors: ["Original", "Spicy"],
};
