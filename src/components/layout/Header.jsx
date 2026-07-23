import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/KUYA KINGS LOGO.png";
import { brand } from "../../lib/constants";

const navigation = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Perfect Pair", to: "/#perfect-pair", hash: "#perfect-pair" },
  { label: "Menu", to: "/menu" },
  { label: "Our Process", to: "/process" },
  { label: "Contact", to: "/contact" },
];

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape") setIsMenuOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen]);

  const isActive = (item) => {
    if (item.hash) return location.pathname === "/" && location.hash === item.hash;
    if (item.to === "/") return location.pathname === "/" && !location.hash;
    return location.pathname === item.to;
  };

  const renderNavigationLink = (item, mobile = false) => {
    const active = isActive(item);
    const className = [
      "kk-header-link",
      mobile ? "kk-header-link--mobile" : "",
      active ? "is-active" : "",
    ].filter(Boolean).join(" ");

    return (
      <Link
        key={item.label}
        to={item.to}
        aria-current={active ? "page" : undefined}
        className={className}
        onClick={() => setIsMenuOpen(false)}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <header className={`kk-header${isScrolled ? " kk-header--scrolled" : ""}`}>
      <div className="kk-header-inner">
        <Link to="/" aria-label={`${brand.shortName} home`} className="kk-header-logo">
          <img src={logo} alt={`${brand.shortName} logo`} />
        </Link>

        <nav aria-label="Primary navigation" className="kk-header-nav">
          {navigation.map((item) => renderNavigationLink(item))}
        </nav>

        <Link to="/order" className="kk-header-cta">Order Now</Link>

        <button
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-controls="kk-header-mobile-menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="kk-header-toggle"
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {isMenuOpen && (
        <div id="kk-header-mobile-menu" className="kk-header-mobile-menu">
          <nav aria-label="Mobile navigation" className="kk-header-mobile-nav">
            {navigation.map((item) => renderNavigationLink(item, true))}
            <Link
              to="/order"
              className="kk-header-cta kk-header-cta--mobile"
              onClick={() => setIsMenuOpen(false)}
            >
              Order Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
