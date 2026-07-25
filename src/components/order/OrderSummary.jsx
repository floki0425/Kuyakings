function JarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 8.5 6.5 5h11L20 8.5" />
      <rect x="4" y="8.5" width="16" height="2.2" rx="0.6" />
      <path d="m8.5 19.5-1-8h9l-1 8a2 2 0 0 1-2 1.8h-3a2 2 0 0 1-2-1.8Z" />
    </svg>
  );
}

function OrderSummary({ items, paymentMethod }) {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <aside className="rounded-lg border border-[#E8E1DE] bg-white p-6 lg:sticky lg:top-24">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#c91f3a]/30 bg-[#F8E6E4] text-[#c91f3a] [&_svg]:h-4.5 [&_svg]:w-4.5 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.6]">
          <JarIcon />
        </span>

        <div>
          <p className="text-xs font-black uppercase tracking-widest text-[#C91F3A]">
            Your Order
          </p>
          <h3 className="font-serif text-xl font-bold text-[#17191C]">
            Order Summary
          </h3>
        </div>
      </div>

      <div className="mt-6 divide-y divide-[#E8E1DE] border-y border-[#E8E1DE] text-sm">
        <div className="flex justify-between gap-4 py-3">
          <span className="text-[#8a8580]">Product</span>
          <span className="font-bold text-[#17191C]">Kuya King&apos;s Beef Tapa</span>
        </div>

        {items.length === 0 ? (
          <div className="flex justify-between gap-4 py-3">
            <span className="text-[#8a8580]">Flavors</span>
            <span className="font-bold text-[#17191C]">—</span>
          </div>
        ) : (
          items.map((item) => {
            const isBundle = item.flavor.toLowerCase().startsWith("bundle");

            return (
              <div key={item.flavor} className="flex justify-between gap-4 py-3">
                <span className="text-[#8a8580]">
                  {item.flavor} × {item.quantity} {isBundle ? "bundle(s)" : "jar(s)"}
                </span>
                <span className="font-bold text-[#17191C]">₱{item.subtotal}</span>
              </div>
            );
          })
        )}

        <div className="flex justify-between gap-4 py-3">
          <span className="text-[#8a8580]">Payment</span>
          <span className="font-bold text-[#17191C]">{paymentMethod}</span>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-[#8a8580]">Subtotal</span>
          <span className="font-black text-[#17191C]">₱{subtotal}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-[#8a8580]">Delivery Fee</span>
          <span className="text-right font-bold text-[#17191C]">
            To be confirmed
          </span>
        </div>
      </div>

      <div className="mt-5 rounded-[0.85rem] bg-[#FFF7F2] p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="font-black text-[#17191C]">Total Product Amount</span>
          <span className="text-2xl font-black text-[#c91f3a]">₱{subtotal}</span>
        </div>
        <p className="mt-2 text-xs leading-5 text-[#5F5B58]">
          Delivery fee is shouldered by the customer.
        </p>
      </div>
    </aside>
  );
}

export default OrderSummary;
