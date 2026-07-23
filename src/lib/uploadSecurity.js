const ALLOWED_IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const uploadLimits = {
  paymentProofBytes: 5 * 1024 * 1024,
  brandPhotoBytes: 8 * 1024 * 1024,
};

export function getImageAcceptAttribute() {
  return Object.keys(ALLOWED_IMAGE_TYPES).join(",");
}

export function validateImageFile(file, { label = "Image", maxBytes } = {}) {
  if (!file) {
    return { isValid: false, error: `${label} is required.` };
  }

  if (!ALLOWED_IMAGE_TYPES[file.type]) {
    return {
      isValid: false,
      error: `${label} must be a JPG, PNG, or WebP image.`,
    };
  }

  if (maxBytes && file.size > maxBytes) {
    return {
      isValid: false,
      error: `${label} must be ${formatBytes(maxBytes)} or smaller.`,
    };
  }

  return { isValid: true, error: "" };
}

export function createSecureImagePath(folder, file) {
  const safeFolder = folder
    .split("/")
    .map((part) => part.toLowerCase().replace(/[^a-z0-9-]+/g, "-"))
    .filter(Boolean)
    .join("/");

  const extension = ALLOWED_IMAGE_TYPES[file.type];

  return `${safeFolder}/${getRandomId()}.${extension}`;
}

export function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) {
    return `${Math.round(bytes / 1024 / 1024)} MB`;
  }

  if (bytes >= 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${bytes} bytes`;
}

function getRandomId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}
