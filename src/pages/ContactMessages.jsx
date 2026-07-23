import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import SEO from "../components/seo/SEO";
import { getAdminSession, signOut } from "../lib/auth";
import { getContactMessagesForAdmin, markContactMessageRead } from "../lib/api";

function formatDate(value) {
  return new Date(value).toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function ContactMessages() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  async function fetchMessages() {
    setLoading(true);

    const { data, error } = await getContactMessagesForAdmin();

    if (error) {
      console.error("Fetch contact messages error:", error);
      alert(`Failed to fetch messages: ${error.message}`);
      setLoading(false);
      return;
    }

    setMessages(data || []);
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

      fetchMessages();
    }

    checkSessionAndFetch();
  }, [navigate]);

  async function toggleRead(message) {
    try {
      setUpdatingId(message.id);

      const { error } = await markContactMessageRead(message.id, !message.is_read);

      if (error) {
        alert(`Failed to update message: ${error.message}`);
        return;
      }

      setMessages((prev) =>
        prev.map((item) =>
          item.id === message.id ? { ...item, is_read: !message.is_read } : item
        )
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const unreadCount = messages.filter((message) => !message.is_read).length;

  return (
    <main className="min-h-screen bg-[#FFF7F2] px-4 py-5 text-[#17191C] sm:px-5">
      <SEO
        title="Contact Messages"
        description="Messages submitted through Kuya King's Contact Us form."
        path="/admin/contact-messages"
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
              Contact Messages
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#5F5B58]">
              Messages submitted through the Contact Us form on the website.
              {unreadCount > 0 && (
                <span className="ml-1 font-black text-[#c91f3a]">
                  {unreadCount} unread.
                </span>
              )}
            </p>
          </div>

          {loading ? (
            <div className="mt-5 rounded-lg border border-[#E8E1DE] bg-white p-8 text-center">
              <p className="font-black text-[#17191C]">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="mt-5 rounded-lg border border-[#E8E1DE] bg-white p-8 text-center">
              <p className="font-black text-[#17191C]">No messages yet.</p>
              <p className="mt-1 text-sm text-[#5F5B58]">
                Submissions from the Contact Us page will show up here.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`kk-fade-in rounded-lg border p-5 sm:p-6 ${
                    message.is_read
                      ? "border-[#E8E1DE] bg-white"
                      : "border-[#c91f3a]/30 bg-[#F8E6E4]"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-serif text-lg font-bold text-[#17191C]">
                          {message.name}
                        </h2>
                        {!message.is_read && (
                          <span className="rounded-full bg-[#c91f3a] px-2 py-0.5 text-[0.65rem] font-black uppercase tracking-wide text-white">
                            New
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[#8a8580]">
                        {formatDate(message.created_at)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleRead(message)}
                      disabled={updatingId === message.id}
                      className="rounded-full border border-[#17191C] px-4 py-2 text-xs font-black text-[#17191C] transition hover:bg-[#17191C] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {updatingId === message.id
                        ? "Updating..."
                        : message.is_read
                        ? "Mark as Unread"
                        : "Mark as Read"}
                    </button>
                  </div>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#5F5B58]">
                    {message.message}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-4 border-t border-[#E8E1DE] pt-3 text-sm">
                    {message.email && (
                      <a
                        href={`mailto:${message.email}`}
                        className="font-black text-[#c91f3a] hover:opacity-75"
                      >
                        {message.email}
                      </a>
                    )}
                    {message.phone && (
                      <a
                        href={`tel:${message.phone}`}
                        className="font-black text-[#c91f3a] hover:opacity-75"
                      >
                        {message.phone}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default ContactMessages;
