import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import SEO from "../components/seo/SEO";
import { supabase } from "../lib/supabaseClient";
import { getAdminSession, signOut } from "../lib/auth";
import { photoUpload } from "../lib/constants";
import {
  createSecureImagePath,
  formatBytes,
  getImageAcceptAttribute,
  uploadLimits,
  validateImageFile,
} from "../lib/uploadSecurity";

const METHODS = [
  { id: "gcash", label: "GCash", fields: ["account_name", "account_number"] },
  { id: "maya", label: "Maya", fields: ["account_name", "account_number"] },
  {
    id: "bank",
    label: "Bank Transfer",
    fields: ["bank_name", "account_name", "account_number"],
  },
];

const FIELD_LABELS = {
  account_name: "Account Name",
  account_number: "Account Number",
  bank_name: "Bank Name",
};

function PaymentSettings() {
  const navigate = useNavigate();

  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [messages, setMessages] = useState({});

  const [selectedQrFiles, setSelectedQrFiles] = useState({});
  const [qrMessages, setQrMessages] = useState({});
  const [uploadingQrId, setUploadingQrId] = useState(null);

  async function fetchSettings() {
    setLoading(true);

    const { data, error } = await supabase
      .from("payment_settings")
      .select("method, account_name, account_number, bank_name, qr_code_url");

    if (error) {
      console.error("Fetch payment settings error:", error);
      alert(`Failed to fetch payment settings: ${error.message}`);
      setLoading(false);
      return;
    }

    setDrafts(Object.fromEntries((data || []).map((row) => [row.method, row])));
    setLoading(false);
  }

  useEffect(() => {
    async function checkSessionAndFetch() {
      const { session, isAdmin, error } = await getAdminSession({ refresh: true });

      if (!session || error || !isAdmin) {
        await signOut();
        navigate("/admin/login", {
          replace: true,
          state: {
            message: session
              ? "Your account does not have the Kuya King's admin role."
              : "Please sign in with the Kuya King's admin account.",
          },
        });
        return;
      }

      fetchSettings();
    }

    checkSessionAndFetch();
  }, [navigate]);

  function updateDraft(methodId, field, value) {
    setDrafts((prev) => ({
      ...prev,
      [methodId]: { ...prev[methodId], [field]: value },
    }));
  }

  async function handleSave(methodId, fields) {
    const draft = drafts[methodId] || {};

    try {
      setSavingId(methodId);

      const payload = { method: methodId };
      fields.forEach((field) => {
        payload[field] = draft[field] || "";
      });

      const { error } = await supabase.from("payment_settings").upsert(payload);

      if (error) {
        setMessages((prev) => ({
          ...prev,
          [methodId]: { type: "error", text: error.message },
        }));
        return;
      }

      setMessages((prev) => ({
        ...prev,
        [methodId]: { type: "success", text: "Saved and live on the site." },
      }));
    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        [methodId]: { type: "error", text: err.message },
      }));
    } finally {
      setSavingId(null);
    }
  }

  function handleQrChange(methodId, file) {
    if (!file) return;

    const validation = validateImageFile(file, {
      label: "QR code image",
      maxBytes: uploadLimits.brandPhotoBytes,
    });

    if (!validation.isValid) {
      setQrMessages((prev) => ({
        ...prev,
        [methodId]: { type: "error", text: validation.error },
      }));
      return;
    }

    setSelectedQrFiles((prev) => {
      if (prev[methodId]?.previewUrl) {
        URL.revokeObjectURL(prev[methodId].previewUrl);
      }

      return {
        ...prev,
        [methodId]: { file, previewUrl: URL.createObjectURL(file) },
      };
    });

    setQrMessages((prev) => ({
      ...prev,
      [methodId]: { type: "ready", text: file.name },
    }));
  }

  async function handleQrUpload(methodId) {
    const selected = selectedQrFiles[methodId];

    if (!selected?.file) {
      setQrMessages((prev) => ({
        ...prev,
        [methodId]: { type: "error", text: "Choose a QR image first." },
      }));
      return;
    }

    setQrMessages((prev) => ({
      ...prev,
      [methodId]: { type: "uploading", text: "Uploading..." },
    }));

    try {
      setUploadingQrId(methodId);

      const { session, isAdmin, error: sessionError } = await getAdminSession({
        refresh: true,
      });

      if (sessionError || !session) {
        setQrMessages((prev) => ({
          ...prev,
          [methodId]: {
            type: "error",
            text: "Your session expired. Sign in again before uploading.",
          },
        }));
        return;
      }

      if (!isAdmin) {
        setQrMessages((prev) => ({
          ...prev,
          [methodId]: {
            type: "error",
            text: "This account does not have the Kuya King's admin upload permission.",
          },
        }));
        return;
      }

      const filePath = createSecureImagePath(
        `${photoUpload.folder}/qr-${methodId}`,
        selected.file
      );

      const { error: uploadError } = await supabase.storage
        .from(photoUpload.bucket)
        .upload(filePath, selected.file, {
          cacheControl: "3600",
          contentType: selected.file.type,
          upsert: false,
        });

      if (uploadError) {
        setQrMessages((prev) => ({
          ...prev,
          [methodId]: { type: "error", text: `Upload failed: ${uploadError.message}` },
        }));
        return;
      }

      const { data } = supabase.storage.from(photoUpload.bucket).getPublicUrl(filePath);

      const { error: saveError } = await supabase
        .from("payment_settings")
        .upsert({ method: methodId, qr_code_url: data.publicUrl });

      if (saveError) {
        setQrMessages((prev) => ({
          ...prev,
          [methodId]: {
            type: "error",
            text: `QR uploaded, but it could not be set live: ${saveError.message}`,
          },
        }));
        return;
      }

      setDrafts((prev) => ({
        ...prev,
        [methodId]: { ...prev[methodId], qr_code_url: data.publicUrl },
      }));

      setQrMessages((prev) => ({
        ...prev,
        [methodId]: { type: "success", text: "QR code uploaded and live." },
      }));
    } finally {
      setUploadingQrId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#FFF7F2] px-4 py-5 text-[#17191C] sm:px-5">
      <SEO
        title="Payment Settings"
        description="Manage Kuya King's GCash, Maya, and bank transfer details."
        path="/admin/payment-settings"
        noIndex
      />
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6">
        <div className="lg:sticky lg:top-5 lg:self-start">
          <AdminSidebar />
        </div>

        <section className="min-w-0">
          <div className="kk-fade-in rounded-lg border border-[#E8E1DE] bg-white p-5 sm:p-6">
            <p className="text-xs font-black uppercase tracking-widest text-[#C91F3A] sm:text-sm">
              Admin Panel
            </p>

            <h1 className="mt-2 font-serif text-2xl font-bold leading-tight text-[#17191C] sm:text-3xl">
              Payment Settings
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#5F5B58]">
              These details, and QR codes, show to customers at checkout when
              they choose GCash, Maya, or Bank Transfer. Leave a method blank
              and customers will see a message to contact you instead.
            </p>
          </div>

          {loading ? (
            <div className="mt-5 rounded-lg border border-[#E8E1DE] bg-white p-8 text-center">
              <p className="font-black text-[#17191C]">
                Loading payment settings...
              </p>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {METHODS.map((method, index) => {
                const draft = drafts[method.id] || {};
                const message = messages[method.id];
                const isSaving = savingId === method.id;

                const selectedQr = selectedQrFiles[method.id];
                const qrMessage = qrMessages[method.id];
                const qrPreviewUrl = selectedQr?.previewUrl || draft.qr_code_url;
                const isUploadingQr = uploadingQrId === method.id;

                return (
                  <div
                    key={method.id}
                    className="kk-fade-in rounded-lg border border-[#E8E1DE] bg-white p-5 sm:p-6"
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    <h2 className="font-serif text-lg font-bold text-[#17191C]">
                      {method.label}
                    </h2>

                    <div className="mt-4 space-y-3">
                      {method.fields.map((field) => (
                        <div key={field}>
                          <label
                            className="text-xs font-black uppercase tracking-wide text-[#8a8580]"
                            htmlFor={`${method.id}-${field}`}
                          >
                            {FIELD_LABELS[field]}
                          </label>
                          <input
                            id={`${method.id}-${field}`}
                            value={draft[field] || ""}
                            onChange={(e) =>
                              updateDraft(method.id, field, e.target.value)
                            }
                            placeholder={`Enter ${FIELD_LABELS[field].toLowerCase()}`}
                            className="kk-input mt-1.5"
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSave(method.id, method.fields)}
                      disabled={isSaving}
                      className="mt-4 w-full rounded-full bg-[#c91f3a] px-4 py-2.5 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </button>

                    {message && (
                      <p
                        className={`mt-3 rounded-[0.85rem] p-3 text-sm font-bold ${
                          message.type === "error"
                            ? "bg-red-50 text-red-700"
                            : "bg-green-50 text-green-800"
                        }`}
                      >
                        {message.text}
                      </p>
                    )}

                    <div className="mt-5 border-t border-[#E8E1DE] pt-4">
                      <p className="text-xs font-black uppercase tracking-wide text-[#8a8580]">
                        QR Code
                      </p>

                      <div className="mt-3 overflow-hidden rounded-[0.85rem] border border-[#E8E1DE] bg-[#FFF7F2]">
                        <div className="flex aspect-square items-center justify-center bg-white">
                          {qrPreviewUrl ? (
                            <img
                              src={qrPreviewUrl}
                              alt={`${method.label} QR code`}
                              className="h-full w-full object-contain p-2"
                            />
                          ) : (
                            <p className="px-5 text-center text-sm font-bold text-[#8a8580]">
                              No QR code live yet
                            </p>
                          )}
                        </div>

                        <div className="space-y-2 p-3">
                          <label
                            htmlFor={`qr-upload-${method.id}`}
                            className="block cursor-pointer rounded-full border border-[#17191C] px-3 py-2 text-center text-xs font-black text-[#17191C] transition hover:bg-[#17191C] hover:text-white"
                          >
                            Choose QR Image
                          </label>

                          <input
                            id={`qr-upload-${method.id}`}
                            type="file"
                            accept={getImageAcceptAttribute()}
                            className="sr-only"
                            onChange={(e) =>
                              handleQrChange(method.id, e.target.files?.[0])
                            }
                          />

                          <button
                            type="button"
                            disabled={!selectedQr || isUploadingQr}
                            onClick={() => handleQrUpload(method.id)}
                            className="w-full rounded-full bg-[#17191C] px-3 py-2 text-xs font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {isUploadingQr ? "Uploading..." : "Upload QR Code"}
                          </button>
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-[#8a8580]">
                        JPG, PNG, or WebP up to{" "}
                        {formatBytes(uploadLimits.brandPhotoBytes)}.
                      </p>

                      {qrMessage && (
                        <p
                          className={`mt-2 rounded-[0.85rem] p-3 text-sm font-bold ${
                            qrMessage.type === "error"
                              ? "bg-red-50 text-red-700"
                              : "bg-white text-[#17191C]"
                          }`}
                        >
                          {qrMessage.text}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default PaymentSettings;
