import { useEffect, useState } from "react";
import { getSitePhotoSlots } from "./api";

let cachedPhotos = null;
let inFlightPromise = null;
const listeners = new Set();

function loadPhotos() {
  if (cachedPhotos) return Promise.resolve(cachedPhotos);

  if (!inFlightPromise) {
    inFlightPromise = getSitePhotoSlots().then(({ data, error }) => {
      inFlightPromise = null;

      if (error || !data) return cachedPhotos;

      cachedPhotos = Object.fromEntries(data.map((row) => [row.slot, row.url]));
      listeners.forEach((listener) => listener(cachedPhotos));

      return cachedPhotos;
    });
  }

  return inFlightPromise;
}

export function useSitePhotoSlots() {
  const [photos, setPhotos] = useState(cachedPhotos || {});

  useEffect(() => {
    if (cachedPhotos) {
      setPhotos(cachedPhotos);
      return;
    }

    listeners.add(setPhotos);
    loadPhotos();

    return () => {
      listeners.delete(setPhotos);
    };
  }, []);

  return photos;
}
