import { Link } from "react-router-dom";
import { brand } from "../../lib/constants";
import logo from "../../assets/KUYA KINGS LOGO.png";

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Perfect Pair", href: "/#perfect-pair" },
  { label: "Menu", href: "/menu" },
  { label: "Our Process", href: "/process" },
];

const careLinks = [
  { label: "How to Order", href: "/#how-to-order" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact Us", href: "/contact" },
  { label: "Track Order", href: "/track-order" },
];

function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M14.5 8.5h2V5.3c-.35-.05-1.54-.15-2.94-.15-2.9 0-4.9 1.77-4.9 5.02v2.63H6v3.6h3.16V21h3.7v-4.6h3.03l.48-3.6h-3.51v-2.3c0-1.04.28-1.75 1.79-1.75Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.85" cy="7.15" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M14.5 4v9.8a2.7 2.7 0 1 1-2.2-2.66" />
      <path d="M14.5 4c.35 2.1 1.9 3.7 4 4v2.2c-1.5 0-2.9-.5-4-1.35" />
    </svg>
  );
}

function SocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="kk-footer-social flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/75 transition hover:border-[#c91f3a] hover:text-[#c91f3a] [&_svg]:h-4 [&_svg]:w-4 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.6]"
    >
      {children}
    </a>
  );
}

function FooterColumn({ title, links }) {
  return (
    <nav className="kk-footer-column" aria-label={title}>
      <h3 className="kk-footer-heading text-xs font-black uppercase tracking-widest text-white/50">
        {title}
      </h3>
      <ul className="kk-footer-links mt-4 space-y-3 text-sm text-white/70">
        {links.map((item) => (
          <li key={item.label}>
            <Link to={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Footer() {
  return (
    <footer
      id="contact"
      className="kk-footer scroll-mt-24 relative isolate overflow-hidden text-white"
    >
      <div className="kk-footer-main relative mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr] lg:gap-8">
        <div className="kk-footer-brand">
          <img src={logo} alt={`${brand.shortName} logo`} className="h-10 w-auto" />

          <p className="kk-footer-description mt-4 max-w-xs text-sm leading-6 text-white/65">
            Homemade Beef Tapa made with 100% pure beef, our signature
            marinade, and the unmistakable taste of home.
          </p>

          <div className="kk-footer-socials mt-5 flex items-center gap-3">
            <SocialLink href={brand.facebookLink} label="Kuya King's on Facebook">
              <FacebookIcon />
            </SocialLink>
            <SocialLink
              href={`https://instagram.com/${brand.instagram}`}
              label="Kuya King's on Instagram"
            >
              <InstagramIcon />
            </SocialLink>
            <SocialLink
              href={`https://www.tiktok.com/@${brand.tiktok}`}
              label="Kuya King's on TikTok"
            >
              <TiktokIcon />
            </SocialLink>
          </div>
        </div>

        <FooterColumn title="Explore" links={exploreLinks} />
        <FooterColumn title="Customer Care" links={careLinks} />

        <div className="kk-footer-column kk-footer-contact">
          <h3 className="kk-footer-heading text-xs font-black uppercase tracking-widest text-white/50">
            Contact Us
          </h3>

          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li>{brand.phone}</li>
            <li>Facebook: {brand.facebook}</li>
            <li>{brand.location}</li>
            <li>{brand.hours}</li>
          </ul>

          <Link
            to="/order"
            className="mt-5 inline-flex rounded-full bg-[#c91f3a] px-6 py-3 text-sm font-black text-white transition hover:opacity-90"
          >
            Order Now
          </Link>
        </div>
      </div>

      <div className="kk-footer-bottom relative border-t border-white/10 px-5 py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Kuya King&apos;s. Made with care, served with flavor.</p>
          <div className="kk-footer-legal flex flex-wrap gap-4">
            <Link to="/legal#privacy-policy" className="transition hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/legal#terms-conditions" className="transition hover:text-white">
              Terms &amp; Conditions
            </Link>
            <Link to="/legal#refund-policy" className="transition hover:text-white">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
