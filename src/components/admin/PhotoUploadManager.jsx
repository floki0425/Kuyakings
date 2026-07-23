import { useEffect, useState } from "react";
import { photoUpload } from "../../lib/constants";
import { supabase } from "../../lib/supabaseClient";
import { getAdminSession } from "../../lib/auth";
import {
  createSecureImagePath,
  formatBytes,
  getImageAcceptAttribute,
  uploadLimits,
  validateImageFile,
} from "../../lib/uploadSecurity";

const PHOTO_SLOTS = [
  {
    id: "hero",
    title: "Hero Photo",
    note: "Homepage top banner",
  },
  {
    id: "story",
    title: "Our Story Photo",
    note: "Homepage \"Our Story\" section",
  },
  {
    id: "pairing-rice",
    title: "Garlic Rice Photo",
    note: "Homepage \"Perfect Pair\" section",
  },
  {
    id: "pairing-atchara",
    title: "Atchara Photo",
    note: "Homepage \"Perfect Pair\" section",
  },
  {
    id: "gallery",
    title: "Process Photo (Homepage)",
    note: "Homepage \"Our Process\" section",
  },
  {
    id: "cta",
    title: "CTA Banner Photo",
    note: "Homepage bottom call-to-action band",
  },
  {
    id: "product",
    title: "Product Photo",
    note: "Order page image",
  },
  {
    id: "about",
    title: "About Page Photo",
    note: "About page intro",
  },
  {
    id: "process-page",
    title: "Process Page Photo",
    note: "Our Process page intro",
  },
];

function PhotoUploadManager() {
  const [selectedPhotos, setSelectedPhotos] = useState({});
  const [uploadedPhotos, setUploadedPhotos] = useState({});
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [messages, setMessages] = useState({});

  const [flavors, setFlavors] = useState([]);
  const [loadingFlavors, setLoadingFlavors] = useState(true);
  const [selectedFlavorPhotos, setSelectedFlavorPhotos] = useState({});
  const [flavorMessages, setFlavorMessages] = useState({});

  useEffect(() => {
    async function fetchCurrentPhotos() {
      const { data, error } = await supabase
        .from("site_photo_slots")
        .select("slot, url");

      if (!error && data) {
        setUploadedPhotos(Object.fromEntries(data.map((row) => [row.slot, row.url])));
      }

      setLoadingPhotos(false);
    }

    async function fetchFlavors() {
      const { data, error } = await supabase
        .from("product_flavors")
        .select("id, name, image_url")
        .order("sort_order", { ascending: true });

      if (!error && data) {
        setFlavors(data);
      }

      setLoadingFlavors(false);
    }

    fetchCurrentPhotos();
    fetchFlavors();
  }, []);

  function handlePhotoChange(slotId, file) {
    if (!file) return;

    const validation = validateImageFile(file, {
      label: "Brand photo",
      maxBytes: uploadLimits.brandPhotoBytes,
    });

    if (!validation.isValid) {
      setMessages((prev) => ({
        ...prev,
        [slotId]: { type: "error", text: validation.error },
      }));
      return;
    }

    setSelectedPhotos((prev) => {
      if (prev[slotId]?.previewUrl) {
        URL.revokeObjectURL(prev[slotId].previewUrl);
      }

      return {
        ...prev,
        [slotId]: {
          file,
          previewUrl: URL.createObjectURL(file),
        },
      };
    });

    setMessages((prev) => ({
      ...prev,
      [slotId]: { type: "ready", text: file.name },
    }));
  }

  async function handleUpload(slotId) {
    const selectedPhoto = selectedPhotos[slotId];

    if (!selectedPhoto?.file) {
      setMessages((prev) => ({
        ...prev,
        [slotId]: { type: "error", text: "Choose a photo first." },
      }));
      return;
    }

    setMessages((prev) => ({
      ...prev,
      [slotId]: { type: "uploading", text: "Uploading..." },
    }));

    const { session, isAdmin, error: sessionError } = await getAdminSession({
      refresh: true,
    });

    if (sessionError || !session) {
      setMessages((prev) => ({
        ...prev,
        [slotId]: {
          type: "error",
          text: "Your session expired. Sign in again before uploading.",
        },
      }));
      return;
    }

    if (!isAdmin) {
      setMessages((prev) => ({
        ...prev,
        [slotId]: {
          type: "error",
          text: "This account does not have the Kuya King's admin upload permission.",
        },
      }));
      return;
    }

    const filePath = createSecureImagePath(
      `${photoUpload.folder}/${slotId}`,
      selectedPhoto.file
    );

    const { error } = await supabase.storage
      .from(photoUpload.bucket)
      .upload(filePath, selectedPhoto.file, {
        cacheControl: "3600",
        contentType: selectedPhoto.file.type,
        upsert: false,
      });

    if (error) {
      setMessages((prev) => ({
        ...prev,
        [slotId]: { type: "error", text: `Upload failed: ${error.message}` },
      }));
      return;
    }

    const { data } = supabase.storage
      .from(photoUpload.bucket)
      .getPublicUrl(filePath);

    const { error: slotError } = await supabase
      .from("site_photo_slots")
      .upsert({ slot: slotId, url: data.publicUrl, updated_at: new Date().toISOString() });

    if (slotError) {
      setMessages((prev) => ({
        ...prev,
        [slotId]: {
          type: "error",
          text: `Photo uploaded, but it could not be set live: ${slotError.message}`,
        },
      }));
      return;
    }

    setUploadedPhotos((prev) => ({
      ...prev,
      [slotId]: data.publicUrl,
    }));

    setMessages((prev) => ({
      ...prev,
      [slotId]: { type: "success", text: "Uploaded and live on the site." },
    }));
  }

  function handleFlavorPhotoChange(flavorId, file) {
    if (!file) return;

    const validation = validateImageFile(file, {
      label: "Flavor photo",
      maxBytes: uploadLimits.brandPhotoBytes,
    });

    if (!validation.isValid) {
      setFlavorMessages((prev) => ({
        ...prev,
        [flavorId]: { type: "error", text: validation.error },
      }));
      return;
    }

    setSelectedFlavorPhotos((prev) => {
      if (prev[flavorId]?.previewUrl) {
        URL.revokeObjectURL(prev[flavorId].previewUrl);
      }

      return {
        ...prev,
        [flavorId]: {
          file,
          previewUrl: URL.createObjectURL(file),
        },
      };
    });

    setFlavorMessages((prev) => ({
      ...prev,
      [flavorId]: { type: "ready", text: file.name },
    }));
  }

  async function handleFlavorUpload(flavorItem) {
    const selectedPhoto = selectedFlavorPhotos[flavorItem.id];

    if (!selectedPhoto?.file) {
      setFlavorMessages((prev) => ({
        ...prev,
        [flavorItem.id]: { type: "error", text: "Choose a photo first." },
      }));
      return;
    }

    setFlavorMessages((prev) => ({
      ...prev,
      [flavorItem.id]: { type: "uploading", text: "Uploading..." },
    }));

    const { session, isAdmin, error: sessionError } = await getAdminSession({
      refresh: true,
    });

    if (sessionError || !session) {
      setFlavorMessages((prev) => ({
        ...prev,
        [flavorItem.id]: {
          type: "error",
          text: "Your session expired. Sign in again before uploading.",
        },
      }));
      return;
    }

    if (!isAdmin) {
      setFlavorMessages((prev) => ({
        ...prev,
        [flavorItem.id]: {
          type: "error",
          text: "This account does not have the Kuya King's admin upload permission.",
        },
      }));
      return;
    }

    const filePath = createSecureImagePath(
      `${photoUpload.folder}/flavor-${flavorItem.id}`,
      selectedPhoto.file
    );

    const { error } = await supabase.storage
      .from(photoUpload.bucket)
      .upload(filePath, selectedPhoto.file, {
        cacheControl: "3600",
        contentType: selectedPhoto.file.type,
        upsert: false,
      });

    if (error) {
      setFlavorMessages((prev) => ({
        ...prev,
        [flavorItem.id]: { type: "error", text: `Upload failed: ${error.message}` },
      }));
      return;
    }

    const { data } = supabase.storage
      .from(photoUpload.bucket)
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("product_flavors")
      .update({ image_url: data.publicUrl })
      .eq("id", flavorItem.id);

    if (updateError) {
      setFlavorMessages((prev) => ({
        ...prev,
        [flavorItem.id]: {
          type: "error",
          text: `Photo uploaded, but it could not be set live: ${updateError.message}`,
        },
      }));
      return;
    }

    setFlavors((prev) =>
      prev.map((item) =>
        item.id === flavorItem.id ? { ...item, image_url: data.publicUrl } : item
      )
    );

    setFlavorMessages((prev) => ({
      ...prev,
      [flavorItem.id]: { type: "success", text: "Uploaded and live on the site." },
    }));
  }

  return (
    <div className="mt-5 rounded-lg border border-[#E8E1DE] bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-[#C91F3A] sm:text-sm">
            Brand Assets
          </p>
          <h2 className="mt-2 font-serif text-xl font-bold text-[#17191C]">
            Photo Uploads
          </h2>
          <p className="mt-1 text-sm text-[#5F5B58]">
            These replace the illustrated placeholders on the live site.
          </p>
        </div>

        <p className="text-sm font-bold text-[#8a8580]">
          JPG, PNG, or WebP up to {formatBytes(uploadLimits.brandPhotoBytes)}
        </p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {PHOTO_SLOTS.map((slot, index) => {
          const selectedPhoto = selectedPhotos[slot.id];
          const uploadedUrl = uploadedPhotos[slot.id];
          const message = messages[slot.id];
          const previewUrl = selectedPhoto?.previewUrl || uploadedUrl;
          const isUploading = message?.type === "uploading";

          return (
            <div
              key={slot.id}
              className="kk-fade-in overflow-hidden rounded-[0.85rem] border border-[#E8E1DE] bg-[#FFF7F2]"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="aspect-[4/3] bg-white">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={slot.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-5 text-center text-sm font-bold text-[#8a8580]">
                    {loadingPhotos ? "Loading..." : "No photo live yet"}
                  </div>
                )}
              </div>

              <div className="space-y-4 p-4">
                <div>
                  <h3 className="font-black text-[#17191C]">{slot.title}</h3>
                  <p className="mt-1 text-sm text-[#5F5B58]">{slot.note}</p>
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor={`photo-upload-${slot.id}`}
                    className="cursor-pointer rounded-full border border-[#17191C] px-4 py-3 text-center text-sm font-black text-[#17191C] transition hover:bg-[#17191C] hover:text-white"
                  >
                    Choose Photo
                  </label>

                  <input
                    id={`photo-upload-${slot.id}`}
                    type="file"
                    accept={getImageAcceptAttribute()}
                    className="sr-only"
                    onChange={(event) =>
                      handlePhotoChange(slot.id, event.target.files?.[0])
                    }
                  />

                  <button
                    type="button"
                    disabled={!selectedPhoto || isUploading}
                    onClick={() => handleUpload(slot.id)}
                    className="rounded-full bg-[#c91f3a] px-4 py-3 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isUploading ? "Uploading..." : "Upload Photo"}
                  </button>
                </div>

                {uploadedUrl && (
                  <a
                    href={uploadedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block break-words text-sm font-black text-[#c91f3a] underline"
                  >
                    Open Live Photo
                  </a>
                )}

                {message && (
                  <p
                    className={`rounded-[0.85rem] p-3 text-sm font-bold ${
                      message.type === "error"
                        ? "bg-red-50 text-red-700"
                        : "bg-white text-[#17191C]"
                    }`}
                  >
                    {message.text}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 border-t border-[#E8E1DE] pt-6">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-[#C91F3A] sm:text-sm">
            Best Sellers
          </p>
          <h2 className="mt-2 font-serif text-xl font-bold text-[#17191C]">
            Flavor Photos
          </h2>
          <p className="mt-1 text-sm text-[#5F5B58]">
            Shown on the homepage Best Sellers card for each product.
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {loadingFlavors ? (
            <p className="text-sm font-bold text-[#8a8580]">Loading products...</p>
          ) : flavors.length === 0 ? (
            <p className="text-sm font-bold text-[#8a8580]">No products found.</p>
          ) : (
            flavors.map((item, index) => {
              const selectedPhoto = selectedFlavorPhotos[item.id];
              const message = flavorMessages[item.id];
              const previewUrl = selectedPhoto?.previewUrl || item.image_url;
              const isUploading = message?.type === "uploading";

              return (
                <div
                  key={item.id}
                  className="kk-fade-in overflow-hidden rounded-[0.85rem] border border-[#E8E1DE] bg-[#FFF7F2]"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div className="aspect-[4/3] bg-white">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-5 text-center text-sm font-bold text-[#8a8580]">
                        {loadingFlavors ? "Loading..." : "No photo live yet"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 p-4">
                    <div>
                      <h3 className="font-black text-[#17191C]">{item.name}</h3>
                      <p className="mt-1 text-sm text-[#5F5B58]">
                        Best Sellers card photo
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <label
                        htmlFor={`flavor-photo-${item.id}`}
                        className="cursor-pointer rounded-full border border-[#17191C] px-4 py-3 text-center text-sm font-black text-[#17191C] transition hover:bg-[#17191C] hover:text-white"
                      >
                        Choose Photo
                      </label>

                      <input
                        id={`flavor-photo-${item.id}`}
                        type="file"
                        accept={getImageAcceptAttribute()}
                        className="sr-only"
                        onChange={(event) =>
                          handleFlavorPhotoChange(item.id, event.target.files?.[0])
                        }
                      />

                      <button
                        type="button"
                        disabled={!selectedPhoto || isUploading}
                        onClick={() => handleFlavorUpload(item)}
                        className="rounded-full bg-[#c91f3a] px-4 py-3 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isUploading ? "Uploading..." : "Upload Photo"}
                      </button>
                    </div>

                    {item.image_url && (
                      <a
                        href={item.image_url}
                        target="_blank"
                        rel="noreferrer"
                        className="block break-words text-sm font-black text-[#c91f3a] underline"
                      >
                        Open Live Photo
                      </a>
                    )}

                    {message && (
                      <p
                        className={`rounded-[0.85rem] p-3 text-sm font-bold ${
                          message.type === "error"
                            ? "bg-red-50 text-red-700"
                            : "bg-white text-[#17191C]"
                        }`}
                      >
                        {message.text}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default PhotoUploadManager;
