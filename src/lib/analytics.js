const GA_MEASUREMENT_ID = import.meta.env?.VITE_GA_MEASUREMENT_ID ?? "";
const META_PIXEL_ID = import.meta.env?.VITE_META_PIXEL_ID ?? "";

let gaInitialized = false;
let metaPixelInitialized = false;
let lastPageViewKey = null;

export function isAdminPath(pathname = "") {
  return pathname.startsWith("/admin");
}

export function setAnalyticsEnabledForPath(pathname) {
  if (typeof window === "undefined") return false;

  const isEnabled = !isAdminPath(pathname);

  if (GA_MEASUREMENT_ID) {
    // This is Google's supported opt-out flag. It also prevents configured
    // GA events from being dispatched if a visitor moves from public content
    // into the admin area after the tag has already loaded.
    window[`ga-disable-${GA_MEASUREMENT_ID}`] = !isEnabled;
  }

  if (!isEnabled) {
    // Returning to the same public history entry after visiting admin should
    // still count as a new public page view.
    lastPageViewKey = null;
  }

  return isEnabled;
}

export function initAnalytics(
  pathname = typeof window !== "undefined" ? window.location.pathname : ""
) {
  if (typeof window === "undefined" || !setAnalyticsEnabledForPath(pathname)) {
    return;
  }

  if (GA_MEASUREMENT_ID && !gaInitialized) {
    const scriptUrl = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    const scriptAlreadyExists = Array.from(document.scripts).some(
      (script) => script.src === scriptUrl
    );

    if (!scriptAlreadyExists) {
      const script = document.createElement("script");
      script.async = true;
      script.src = scriptUrl;
      script.dataset.ga4MeasurementId = GA_MEASUREMENT_ID;
      document.head.appendChild(script);
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtag() {
        window.dataLayer.push(arguments);
      };
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
    gaInitialized = true;
  }

  if (META_PIXEL_ID && !metaPixelInitialized) {
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      "script",
      "https://connect.facebook.net/en_US/fbevents.js"
    );

    window.fbq("init", META_PIXEL_ID);
    metaPixelInitialized = true;
  }
}

export function trackPageView({
  pagePath,
  pageLocation,
  pageTitle,
  navigationKey,
}) {
  if (
    typeof window === "undefined" ||
    !setAnalyticsEnabledForPath(window.location.pathname)
  ) {
    return;
  }

  initAnalytics(window.location.pathname);

  const pageViewKey = navigationKey || pageLocation || pagePath;
  if (lastPageViewKey === pageViewKey) return;

  let eventSent = false;

  if (GA_MEASUREMENT_ID && window.gtag) {
    window.gtag("event", "page_view", {
      page_path: pagePath,
      page_location: pageLocation,
      page_title: pageTitle,
    });
    eventSent = true;
  }

  if (META_PIXEL_ID && window.fbq) {
    window.fbq("track", "PageView");
    eventSent = true;
  }

  if (eventSent) {
    lastPageViewKey = pageViewKey;
  }
}

export function trackOrderSubmitted({ value, productCount }) {
  if (
    typeof window === "undefined" ||
    !setAnalyticsEnabledForPath(window.location.pathname)
  ) {
    return;
  }

  initAnalytics(window.location.pathname);

  if (GA_MEASUREMENT_ID && window.gtag) {
    window.gtag("event", "order_submitted", {
      value: Number(value),
      currency: "PHP",
      product_count: Number(productCount),
    });
  }
}
