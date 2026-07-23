import { useEffect, useState } from "react";
import { getSitePhotoSlots } from "./api";

export function useSitePhotoSlots() {
  const [photos, setPhotos] = useState({});

  useEffect(() => {
    let active = true;

    async function fetchPhotos() {
      const { data, error } = await getSitePhotoSlots();

      if (!active || error || !data) return;

      setPhotos(Object.fromEntries(data.map((row) => [row.slot, row.url])));
    }

    fetchPhotos();

    return () => {
      active = false;
    };
  }, []);

  return photos;
}
