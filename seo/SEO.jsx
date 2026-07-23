import { useEffect } from "react";
import { brand } from "../src/lib/constants";

const DEFAULT_IMAGE = "/favicon.png";

function getBaseUrl() {
  if (brand.siteUrl) return brand.siteUrl.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;

  const baseUrl = getBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

function upsertMeta(attribute, key, content) {
  if (!content) return;

  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function upsertCanonical(href) {
  let element = document.head.querySelector('link[rel="canonical"]');

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
}

function upsertJsonLd(id, data) {
  const existing = document.getElementById(id);

  if (!data) {
    existing?.remove();
    return;
  }

  const element = existing || document.createElement("script");

  element.id = id;
  element.type = "application/ld+json";
  element.textContent = JSON.stringify(data);

  if (!existing) {
    document.head.appendChild(element);
  }
}

function SEO({
  title,
  description = brand.description,
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  noIndex = false,
  jsonLd,
}) {
  useEffect(() => {
    const pageTitle = title.includes(brand.shortName)
      ? title
      : `${title} | ${brand.shortName}`;
    const canonicalUrl = absoluteUrl(path);
    const imageUrl = absoluteUrl(image);
    const robots = noIndex
      ? "noindex,nofollow"
      : "index,follow,max-image-preview:large";
    const schema =
      typeof jsonLd === "function"
        ? jsonLd({ canonicalUrl, imageUrl })
        : jsonLd;

    document.title = pageTitle;

    upsertMeta("name", "description", description);
    upsertMeta("name", "keywords", brand.keywords.join(", "));
    upsertMeta("name", "robots", robots);
    upsertMeta("name", "author", brand.shortName);
    upsertMeta("name", "theme-color", "#C92F45");

    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:site_name", brand.shortName);
    upsertMeta("property", "og:locale", "en_PH");
    upsertMeta("property", "og:title", pageTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:image", imageUrl);
    upsertMeta("property", "og:image:alt", brand.name);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", pageTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", imageUrl);

    upsertCanonical(canonicalUrl);
    upsertJsonLd("page-structured-data", schema);
  }, [description, image, jsonLd, noIndex, path, title, type]);

  return null;
}

export default SEO;
