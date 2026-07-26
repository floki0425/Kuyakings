import { useEffect, useState } from "react";
import { photoUpload } from "../../lib/constants";
import { supabase } from "../../lib/supabaseClient";
import { getAdminSession } from "../../lib/auth";
import { invalidateReviewPhotosCache } from "../../lib/useReviewPhotos";
import {
  createSecureImagePath,
  formatBytes,
  getImageAcceptAttribute,
  uploadLimits,
  validateImageFile,
} from "../../lib/uploadSecurity";

function getRandomId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

async function requireAdminSession() {
  const { session, isAdmin, error } = await getAdminSession({ refresh: true });

  if (error || !session) {
    return { ok: false, message: "Your session expired. Sign in again before uploading." };
  }

  if (!isAdmin) {
    return {
      ok: false,
      message: "This account does not have the Kuya King's admin upload permission.",
    };
  }

  return { ok: true };
}

function ReviewPhotosManager() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingUploads, setPendingUploads] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [addMessage, setAddMessage] = useState(null);
  const [replacing, setReplacing] = useState({});
  const [rowMessages, setRowMessages] = useState({});
  const [busyIds, setBusyIds] = useState({});
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);

  useEffect(() => {
    async function fetchPhotos() {
      const { data, error } = await supabase
        .from("review_photos")
        .select("id, url, storage_path, sort_order")
        .order("sort_order", { ascending: true });

      if (!error && data) setPhotos(data);
      setLoading(false);
    }

    fetchPhotos();
  }, []);

  function syncPhotos(nextPhotos) {
    setPhotos(nextPhotos);
    invalidateReviewPhotosCache(nextPhotos);
  }

  function setRowMessage(id, message) {
    setRowMessages((prev) => ({ ...prev, [id]: message }));
  }

  function setBusy(id, value) {
    setBusyIds((prev) => ({ ...prev, [id]: value }));
  }

  function handleAddFiles(fileList) {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    const nextPending = [];
    let firstError = "";

    for (const file of files) {
      const validation = validateImageFile(file, {
        label: "Review photo",
        maxBytes: uploadLimits.brandPhotoBytes,
      });

      if (!validation.isValid) {
        firstError = firstError || validation.error;
        continue;
      }

      nextPending.push({
        localId: getRandomId(),
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    if (nextPending.length > 0) {
      setPendingUploads((prev) => [...prev, ...nextPending]);
    }

    setAddMessage(
      firstError
        ? { type: "error", text: firstError }
        : nextPending.length > 0
          ? null
          : { type: "error", text: "Choose at least one photo." }
    );
  }

  function removePending(localId) {
    setPendingUploads((prev) => {
      const target = prev.find((item) => item.localId === localId);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((item) => item.localId !== localId);
    });
  }

  async function handleUploadPending() {
    if (pendingUploads.length === 0) return;

    setUploading(true);
    setAddMessage(null);

    const auth = await requireAdminSession();
    if (!auth.ok) {
      setUploading(false);
      setAddMessage({ type: "error", text: auth.message });
      return;
    }

    let nextSortOrder =
      photos.reduce((max, photo) => Math.max(max, photo.sort_order), -1) + 1;

    const uploaded = [];
    let uploadError = "";

    for (const item of pendingUploads) {
      const id = getRandomId();
      const filePath = createSecureImagePath(
        `${photoUpload.folder}/review-${id}`,
        item.file
      );

      const { error: storageError } = await supabase.storage
        .from(photoUpload.bucket)
        .upload(filePath, item.file, {
          cacheControl: "3600",
          contentType: item.file.type,
          upsert: false,
        });

      if (storageError) {
        uploadError = `Upload failed: ${storageError.message}`;
        break;
      }

      const { data: publicUrlData } = supabase.storage
        .from(photoUpload.bucket)
        .getPublicUrl(filePath);

      const row = {
        id,
        url: publicUrlData.publicUrl,
        storage_path: filePath,
        sort_order: nextSortOrder,
      };
      nextSortOrder += 1;

      const { error: insertError } = await supabase
        .from("review_photos")
        .insert(row);

      if (insertError) {
        uploadError = `Photo uploaded, but it could not be saved: ${insertError.message}`;
        break;
      }

      uploaded.push(row);
      URL.revokeObjectURL(item.previewUrl);
    }

    const remaining = pendingUploads.slice(uploaded.length);
    setPendingUploads(remaining);

    if (uploaded.length > 0) {
      syncPhotos([...photos, ...uploaded]);
    }

    setUploading(false);
    setAddMessage(
      uploadError
        ? { type: "error", text: uploadError }
        : { type: "success", text: `Uploaded ${uploaded.length} photo(s).` }
    );
  }

  function handleReplaceChange(photoId, file) {
    if (!file) return;

    const validation = validateImageFile(file, {
      label: "Review photo",
      maxBytes: uploadLimits.brandPhotoBytes,
    });

    if (!validation.isValid) {
      setRowMessage(photoId, { type: "error", text: validation.error });
      return;
    }

    setReplacing((prev) => {
      if (prev[photoId]?.previewUrl) URL.revokeObjectURL(prev[photoId].previewUrl);
      return { ...prev, [photoId]: { file, previewUrl: URL.createObjectURL(file) } };
    });
    setRowMessage(photoId, null);
  }

  function cancelReplace(photoId) {
    setReplacing((prev) => {
      if (prev[photoId]?.previewUrl) URL.revokeObjectURL(prev[photoId].previewUrl);
      const next = { ...prev };
      delete next[photoId];
      return next;
    });
  }

  async function confirmReplace(photo) {
    const pending = replacing[photo.id];
    if (!pending) return;

    setBusy(photo.id, true);
    setRowMessage(photo.id, null);

    const auth = await requireAdminSession();
    if (!auth.ok) {
      setBusy(photo.id, false);
      setRowMessage(photo.id, { type: "error", text: auth.message });
      return;
    }

    const filePath = createSecureImagePath(
      `${photoUpload.folder}/review-${photo.id}`,
      pending.file
    );

    const { error: storageError } = await supabase.storage
      .from(photoUpload.bucket)
      .upload(filePath, pending.file, {
        cacheControl: "3600",
        contentType: pending.file.type,
        upsert: false,
      });

    if (storageError) {
      setBusy(photo.id, false);
      setRowMessage(photo.id, { type: "error", text: `Upload failed: ${storageError.message}` });
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from(photoUpload.bucket)
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("review_photos")
      .update({ url: publicUrlData.publicUrl, storage_path: filePath })
      .eq("id", photo.id);

    if (updateError) {
      setBusy(photo.id, false);
      setRowMessage(photo.id, {
        type: "error",
        text: `Uploaded, but the photo could not be saved: ${updateError.message}`,
      });
      return;
    }

    // Best-effort cleanup of the old file; a failure here doesn't affect the
    // photo that's now live, so it isn't surfaced as an error.
    await supabase.storage.from(photoUpload.bucket).remove([photo.storage_path]);

    const nextPhotos = photos.map((item) =>
      item.id === photo.id
        ? { ...item, url: publicUrlData.publicUrl, storage_path: filePath }
        : item
    );
    syncPhotos(nextPhotos);
    cancelReplace(photo.id);
    setBusy(photo.id, false);
    setRowMessage(photo.id, { type: "success", text: "Photo replaced." });
  }

  async function handleDelete(photo) {
    setBusy(photo.id, true);
    setRowMessage(photo.id, null);

    const auth = await requireAdminSession();
    if (!auth.ok) {
      setBusy(photo.id, false);
      setRowMessage(photo.id, { type: "error", text: auth.message });
      return;
    }

    const { error: deleteError } = await supabase
      .from("review_photos")
      .delete()
      .eq("id", photo.id);

    if (deleteError) {
      setBusy(photo.id, false);
      setRowMessage(photo.id, { type: "error", text: `Could not delete: ${deleteError.message}` });
      return;
    }

    await supabase.storage.from(photoUpload.bucket).remove([photo.storage_path]);

    syncPhotos(photos.filter((item) => item.id !== photo.id));
    setConfirmingDeleteId(null);
    setBusy(photo.id, false);
  }

  async function movePhoto(index, direction) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= photos.length) return;

    const current = photos[index];
    const target = photos[targetIndex];

    setBusy(current.id, true);
    setBusy(target.id, true);

    const auth = await requireAdminSession();
    if (!auth.ok) {
      setBusy(current.id, false);
      setBusy(target.id, false);
      setRowMessage(current.id, { type: "error", text: auth.message });
      return;
    }

    const [{ error: errorA }, { error: errorB }] = await Promise.all([
      supabase
        .from("review_photos")
        .update({ sort_order: target.sort_order })
        .eq("id", current.id),
      supabase
        .from("review_photos")
        .update({ sort_order: current.sort_order })
        .eq("id", target.id),
    ]);

    setBusy(current.id, false);
    setBusy(target.id, false);

    if (errorA || errorB) {
      setRowMessage(current.id, {
        type: "error",
        text: `Could not reorder: ${(errorA || errorB).message}`,
      });
      return;
    }

    const nextPhotos = [...photos];
    nextPhotos[index] = { ...target, sort_order: current.sort_order };
    nextPhotos[targetIndex] = { ...current, sort_order: target.sort_order };
    syncPhotos(nextPhotos);
  }

  return (
    <div className="mt-5 rounded-lg border border-[#E8E1DE] bg-white p-5 sm:p-6">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-[#C91F3A] sm:text-sm">
          Reviews Section
        </p>
        <h2 className="mt-2 font-serif text-xl font-bold text-[#17191C]">
          Review Photos
        </h2>
        <p className="mt-1 text-sm text-[#5F5B58]">
          Photos shown in the homepage Reviews carousel. Upload, reorder, replace,
          or delete as many as you like — JPG, PNG, or WebP up to{" "}
          {formatBytes(uploadLimits.brandPhotoBytes)} each.
        </p>
      </div>

      {loading ? (
        <p className="mt-5 text-sm font-bold text-[#8a8580]">Loading...</p>
      ) : (
        <>
          {photos.length === 0 && pendingUploads.length === 0 && (
            <p className="mt-5 rounded-[0.85rem] border border-dashed border-[#D9D0CB] p-4 text-sm text-[#8a8580]">
              No review photos yet. The carousel stays hidden on the live site
              until at least one is uploaded.
            </p>
          )}

          {photos.length > 0 && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo, index) => {
                const pending = replacing[photo.id];
                const message = rowMessages[photo.id];
                const isBusy = Boolean(busyIds[photo.id]);
                const isConfirmingDelete = confirmingDeleteId === photo.id;

                return (
                  <div
                    key={photo.id}
                    className="overflow-hidden rounded-[0.85rem] border border-[#E8E1DE] bg-[#FFF7F2]"
                  >
                    <div className="aspect-[4/3] bg-white">
                      <img
                        src={pending?.previewUrl || photo.url}
                        alt="Review"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="space-y-3 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wide text-[#8a8580]">
                          Photo {index + 1}
                        </span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            disabled={index === 0 || isBusy}
                            onClick={() => movePhoto(index, -1)}
                            aria-label="Move earlier"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#17191C]/20 text-[#17191C] transition hover:bg-[#17191C] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            &uarr;
                          </button>
                          <button
                            type="button"
                            disabled={index === photos.length - 1 || isBusy}
                            onClick={() => movePhoto(index, 1)}
                            aria-label="Move later"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#17191C]/20 text-[#17191C] transition hover:bg-[#17191C] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            &darr;
                          </button>
                        </div>
                      </div>

                      {pending ? (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => confirmReplace(photo)}
                            className="rounded-xl bg-[#c91f3a] px-3 py-2 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isBusy ? "Saving..." : "Save"}
                          </button>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => cancelReplace(photo.id)}
                            className="rounded-xl border border-[#17191C] px-3 py-2 text-sm font-black text-[#17191C] transition hover:bg-[#17191C] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : isConfirmingDelete ? (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleDelete(photo)}
                            className="rounded-xl bg-red-700 px-3 py-2 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isBusy ? "Deleting..." : "Confirm Delete"}
                          </button>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => setConfirmingDeleteId(null)}
                            className="rounded-xl border border-[#17191C] px-3 py-2 text-sm font-black text-[#17191C] transition hover:bg-[#17191C] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <label
                            htmlFor={`review-replace-${photo.id}`}
                            className="cursor-pointer rounded-xl border border-[#17191C] px-3 py-2 text-center text-sm font-black text-[#17191C] transition hover:bg-[#17191C] hover:text-white"
                          >
                            Replace
                          </label>
                          <input
                            id={`review-replace-${photo.id}`}
                            type="file"
                            accept={getImageAcceptAttribute()}
                            className="sr-only"
                            onChange={(event) =>
                              handleReplaceChange(photo.id, event.target.files?.[0])
                            }
                          />
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => setConfirmingDeleteId(photo.id)}
                            className="rounded-xl border border-red-700 px-3 py-2 text-sm font-black text-red-700 transition hover:bg-red-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
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
          )}

          {pendingUploads.length > 0 && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pendingUploads.map((item) => (
                <div
                  key={item.localId}
                  className="overflow-hidden rounded-[0.85rem] border border-dashed border-[#c91f3a]/40 bg-[#FFF7F2]"
                >
                  <div className="aspect-[4/3] bg-white">
                    <img
                      src={item.previewUrl}
                      alt="Pending upload preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="truncate text-xs font-bold text-[#8a8580]">
                      {item.file.name}
                    </p>
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => removePending(item.localId)}
                      className="mt-2 w-full rounded-xl border border-[#17191C] px-3 py-2 text-sm font-black text-[#17191C] transition hover:bg-[#17191C] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 grid gap-2 sm:flex sm:items-center">
            <label
              htmlFor="review-photos-add"
              className="cursor-pointer rounded-xl border border-[#17191C] px-4 py-3 text-center text-sm font-black text-[#17191C] transition hover:bg-[#17191C] hover:text-white"
            >
              Choose Photo(s)
            </label>
            <input
              id="review-photos-add"
              type="file"
              multiple
              accept={getImageAcceptAttribute()}
              className="sr-only"
              onChange={(event) => {
                handleAddFiles(event.target.files);
                event.target.value = "";
              }}
            />

            {pendingUploads.length > 0 && (
              <button
                type="button"
                disabled={uploading}
                onClick={handleUploadPending}
                className="rounded-xl bg-[#c91f3a] px-4 py-3 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading
                  ? "Uploading..."
                  : `Upload ${pendingUploads.length} Photo(s)`}
              </button>
            )}
          </div>

          {addMessage && (
            <p
              className={`mt-3 rounded-[0.85rem] p-3 text-sm font-bold ${
                addMessage.type === "error"
                  ? "bg-red-50 text-red-700"
                  : "bg-white text-[#17191C]"
              }`}
            >
              {addMessage.text}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default ReviewPhotosManager;
