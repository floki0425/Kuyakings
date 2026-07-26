import { useEffect, useState } from "react";
import { getReviewPhotos } from "./api";

let cachedPhotos = null;
let inFlightPromise = null;
const listeners = new Set();

function loadPhotos() {
  if (cachedPhotos) return Promise.resolve(cachedPhotos);

  if (!inFlightPromise) {
    inFlightPromise = getReviewPhotos().then(({ data, error }) => {
      inFlightPromise = null;

      if (error || !data) return cachedPhotos;

      cachedPhotos = data;
      listeners.forEach((listener) => listener(cachedPhotos));

      return cachedPhotos;
    });
  }

  return inFlightPromise;
}

export function invalidateReviewPhotosCache(nextPhotos) {
  cachedPhotos = nextPhotos;
  listeners.forEach((listener) => listener(cachedPhotos));
}

export function useReviewPhotos() {
  const [photos, setPhotos] = useState(cachedPhotos || []);

  useEffect(() => {
    listeners.add(setPhotos);
    loadPhotos();

    return () => {
      listeners.delete(setPhotos);
    };
  }, []);

  return photos;
}
