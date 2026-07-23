import { useLocation } from "react-router-dom";
import { brand } from "../../lib/constants";

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8c-1.1 0-2.1-.2-3-.6L5 20l1.1-3.8A7.9 7.9 0 0 1 4 12Z" />
      <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MessengerButton() {
  const { pathname } = useLocation();

  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      href={brand.facebookLink}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Chat with Kuya King's on Facebook Messenger"
      className="kk-pop-in fixed bottom-24 right-5 z-40 flex items-center gap-2 rounded-full bg-[#c91f3a] py-3.5 pl-3.5 pr-4 text-sm font-black text-white shadow-[0_14px_30px_rgba(151,23,44,0.35)] transition hover:-translate-y-0.5 hover:bg-[#a61930] min-[421px]:bottom-6 min-[421px]:right-6 [&_svg]:h-5 [&_svg]:w-5 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.6]"
    >
      <ChatIcon />
      <span className="hidden min-[421px]:inline">Chat with us</span>
    </a>
  );
}

export default MessengerButton;
