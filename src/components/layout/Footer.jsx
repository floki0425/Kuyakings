import { brand } from "../../lib/constants";

function Footer() {
  return (
    <footer className="border-t border-[#D8D0C3] bg-[#25382B] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sm font-black text-[#25382B]">
              PG
            </div>

            <div>
              <p className="text-lg font-black leading-none">PURE GRIND</p>
              <p className="text-xs font-semibold text-white/70">
                PROTEIN CHIPS
              </p>
            </div>
          </div>

          <p className="mt-4 max-w-xs text-sm leading-6 text-white/70">
            High-protein snack made for your grind. Crunchy, convenient, and
            packed with protein.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-[#D96C2C]">
            Quick Links
          </h3>

          <div className="mt-4 grid gap-3 text-sm text-white/75">
            <a href="/#benefits" className="hover:text-white">
              Benefits
            </a>
            <a href="/#nutrition" className="hover:text-white">
              Nutrition
            </a>
            <a href="/#flavors" className="hover:text-white">
              Flavors
            </a>
            <a href="/#faq" className="hover:text-white">
              FAQ
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-[#D96C2C]">
            Contact
          </h3>

          <div className="mt-4 space-y-3 text-sm text-white/75">
            <p>Phone: {brand.phone}</p>
            <p>Messenger: {brand.messenger}</p>
            <p>Facebook: {brand.facebook}</p>
            <p>Delivery Area: Metro Manila</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-[#D96C2C]">
            Order
          </h3>

          <p className="mt-4 text-sm leading-6 text-white/70">
            Ready to fuel your grind? Place your order online and wait for
            confirmation.
          </p>

          <a
            href="/order"
            className="mt-5 inline-flex rounded-full bg-[#D96C2C] px-6 py-3 text-sm font-black text-white transition hover:opacity-90"
          >
            Order Now
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Pure Grind PH. All rights reserved.</p>

          <div className="flex flex-wrap gap-4">
            <span>GCash</span>
            <span>Maya</span>
            <span>Bank Transfer</span>
            <span>COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;