import { useEffect, useState } from "react";
import { getAdminSession } from "../../lib/auth";
import { getSiteTextContent, upsertSiteTextContent } from "../../lib/api";

const TEXT_FIELDS = [
  {
    key: "pairing-rice-name",
    label: "Garlic Rice — Title",
    note: "Homepage \"Perfect Pair\" section",
    type: "text",
    defaultValue: "Garlic Rice",
  },
  {
    key: "pairing-rice-description",
    label: "Garlic Rice — Description",
    note: "Homepage \"Perfect Pair\" section",
    type: "textarea",
    defaultValue:
      "Warm, fragrant, and perfectly buttery—the ultimate partner for all things real. For that home-cooked flavor.",
  },
  {
    key: "pairing-atchara-name",
    label: "Atchara — Title",
    note: "Homepage \"Perfect Pair\" section",
    type: "text",
    defaultValue: "Atchara",
  },
  {
    key: "pairing-atchara-description",
    label: "Atchara — Description",
    note: "Homepage \"Perfect Pair\" section",
    type: "textarea",
    defaultValue:
      "A refreshing pickled side that complements Beef Tapa's savory richness perfectly.",
  },
];

function TextContentManager() {
  const [savedValues, setSavedValues] = useState({});
  const [draftValues, setDraftValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState({});
  const [savingKey, setSavingKey] = useState(null);

  useEffect(() => {
    async function fetchContent() {
      const { data, error } = await getSiteTextContent();

      if (!error && data) {
        const current = Object.fromEntries(data.map((row) => [row.key, row.value]));
        setSavedValues(current);
        setDraftValues(current);
      }

      setLoading(false);
    }

    fetchContent();
  }, []);

  function updateDraft(key, value) {
    setDraftValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(field) {
    const value = (draftValues[field.key] ?? "").trim() || field.defaultValue;

    setSavingKey(field.key);
    setMessages((prev) => ({ ...prev, [field.key]: null }));

    const { session, isAdmin, error: sessionError } = await getAdminSession({
      refresh: true,
    });

    if (sessionError || !session) {
      setMessages((prev) => ({
        ...prev,
        [field.key]: {
          type: "error",
          text: "Your session expired. Sign in again before saving.",
        },
      }));
      setSavingKey(null);
      return;
    }

    if (!isAdmin) {
      setMessages((prev) => ({
        ...prev,
        [field.key]: {
          type: "error",
          text: "This account does not have the Kuya King's admin permission.",
        },
      }));
      setSavingKey(null);
      return;
    }

    const { error } = await upsertSiteTextContent(field.key, value);

    if (error) {
      setMessages((prev) => ({
        ...prev,
        [field.key]: { type: "error", text: `Save failed: ${error.message}` },
      }));
      setSavingKey(null);
      return;
    }

    setSavedValues((prev) => ({ ...prev, [field.key]: value }));
    setDraftValues((prev) => ({ ...prev, [field.key]: value }));
    setMessages((prev) => ({
      ...prev,
      [field.key]: { type: "success", text: "Saved and live on the site." },
    }));
    setSavingKey(null);
  }

  return (
    <div className="mt-5 rounded-lg border border-[#E8E1DE] bg-white p-5 sm:p-6">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-[#C91F3A] sm:text-sm">
          Brand Assets
        </p>
        <h2 className="mt-2 font-serif text-xl font-bold text-[#17191C]">
          Page Text
        </h2>
        <p className="mt-1 text-sm text-[#5F5B58]">
          Edit titles and descriptions shown on the live site. Leave a field
          blank and save to fall back to the default text.
        </p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {TEXT_FIELDS.map((field, index) => {
          const draftValue = draftValues[field.key] ?? field.defaultValue;
          const isDirty = draftValue !== (savedValues[field.key] ?? field.defaultValue);
          const message = messages[field.key];
          const isSaving = savingKey === field.key;

          return (
            <div
              key={field.key}
              className="kk-fade-in space-y-3 rounded-[0.85rem] border border-[#E8E1DE] bg-[#FFF7F2] p-4"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div>
                <h3 className="font-black text-[#17191C]">{field.label}</h3>
                <p className="mt-1 text-sm text-[#5F5B58]">{field.note}</p>
              </div>

              {field.type === "textarea" ? (
                <textarea
                  value={loading ? "" : draftValue}
                  onChange={(event) => updateDraft(field.key, event.target.value)}
                  placeholder={field.defaultValue}
                  rows={3}
                  disabled={loading}
                  className="kk-input resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={loading ? "" : draftValue}
                  onChange={(event) => updateDraft(field.key, event.target.value)}
                  placeholder={field.defaultValue}
                  disabled={loading}
                  className="kk-input"
                />
              )}

              <button
                type="button"
                disabled={loading || isSaving || !isDirty}
                onClick={() => handleSave(field)}
                className="rounded-xl bg-[#c91f3a] px-4 py-2.5 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>

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
          );
        })}
      </div>
    </div>
  );
}

export default TextContentManager;
