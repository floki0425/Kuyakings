import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  isAdminPath,
  setAnalyticsEnabledForPath,
  trackPageView,
} from "../../lib/analytics";

function Analytics() {
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    const pagePath = location.pathname + location.search;

    // Apply the admin opt-out immediately for this render. Initialization and
    // page-view dispatch happen only for public routes.
    if (
      !setAnalyticsEnabledForPath(location.pathname) ||
      isAdminPath(location.pathname)
    ) {
      return undefined;
    }

    // SEO metadata is updated in page effects. Waiting for the current effect
    // cycle to finish ensures GA receives the new route's document title.
    queueMicrotask(() => {
      if (cancelled) return;

      trackPageView({
        pagePath,
        pageLocation: window.location.href,
        pageTitle: document.title,
        navigationKey: `${location.key}:${pagePath}`,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [location.key, location.pathname, location.search]);

  return null;
}

export default Analytics;
