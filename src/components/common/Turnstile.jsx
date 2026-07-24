import { useEffect, useRef } from "react";

const SITE_KEY = import.meta.env?.VITE_TURNSTILE_SITE_KEY ?? "";
const SCRIPT_SRC = "https://challenge.cloudflare.com/turnstile/v0/api.js";

let scriptPromise = null;

function loadTurnstileScript() {
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Turnstile"));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

// Renders nothing until VITE_TURNSTILE_SITE_KEY is configured, so forms keep
// working on the honeypot guard alone until the site key is registered.
function Turnstile({ onVerify, onExpire }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  // Keep the latest callbacks in refs so the mount effect below doesn't need
  // them as dependencies -- onVerify/onExpire are commonly passed as inline
  // arrow functions that change identity every render, which would otherwise
  // tear down and re-render the widget on every keystroke elsewhere in the form.
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onVerifyRef.current = onVerify;
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    if (!SITE_KEY) return undefined;

    let cancelled = false;

    loadTurnstileScript().then(() => {
      if (cancelled || !containerRef.current || !window.turnstile) return;

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        callback: (token) => onVerifyRef.current?.(token),
        "expired-callback": () => onExpireRef.current?.(),
        "error-callback": () => onExpireRef.current?.(),
      });
    });

    return () => {
      cancelled = true;
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, []);

  if (!SITE_KEY) return null;

  return <div ref={containerRef} className="kk-turnstile" />;
}

export default Turnstile;
