import { useEffect, useState } from "react";
import { getSiteTextContent } from "./api";

let cachedContent = null;
let inFlightPromise = null;
const listeners = new Set();

function loadContent() {
  if (cachedContent) return Promise.resolve(cachedContent);

  if (!inFlightPromise) {
    inFlightPromise = getSiteTextContent().then(({ data, error }) => {
      inFlightPromise = null;

      if (error || !data) return cachedContent;

      cachedContent = Object.fromEntries(data.map((row) => [row.key, row.value]));
      listeners.forEach((listener) => listener(cachedContent));

      return cachedContent;
    });
  }

  return inFlightPromise;
}

export function useSiteTextContent() {
  const [content, setContent] = useState(cachedContent || {});

  useEffect(() => {
    listeners.add(setContent);
    loadContent();

    return () => {
      listeners.delete(setContent);
    };
  }, []);

  return content;
}
