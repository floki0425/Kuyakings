import { brand } from "../../lib/constants";

function OrderSummary({ flavor, quantity, paymentMethod }) {
  const subtotal = quantity * brand.pricePerPack;
  const freeDelivery = quantity >= 12;

  return (
    <aside className="rounded-[2rem] border border-[#D8D0C3] bg-white p-6 shadow-sm lg:sticky lg:top-24">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-[#D96C2C]">
            Your Order
          </p>
          <h3 className="mt-2 text-2xl font-black text-[#25382B]">
            Order Summary
          </h3>
        </div>

        <div className="rounded-full bg-[#DDE8D2] px-3 py-1 text-sm font-black text-[#25382B]">
          ₱{brand.pricePerPack}/pack
        </div>
      </div>

      <div className="mt-6 space-y-4 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-[#555]">Product</span>
          <span className="font-bold text-[#25382B]">Pure Grind Protein Chips</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-[#555]">Flavor</span>
          <span className="font-bold text-[#25382B]">{flavor}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-[#555]">Quantity</span>
          <span className="font-bold text-[#25382B]">{quantity} pack(s)</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-[#555]">Payment</span>
          <span className="font-bold text-[#25382B]">{paymentMethod}</span>
        </div>

        <div className="border-t border-[#D8D0C3] pt-4">
          <div className="flex justify-between gap-4">
            <span className="text-[#555]">Subtotal</span>
            <span className="font-black text-[#25382B]">₱{subtotal}</span>
          </div>

          <div className="mt-3 flex justify-between gap-4">
            <span className="text-[#555]">Delivery Fee</span>
            <span className="text-right font-bold text-[#25382B]">
              {freeDelivery ? "Free delivery may apply" : "To be confirmed"}
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-[#F8F1E7] p-4">
          <div className="flex justify-between gap-4">
            <span className="font-black text-[#25382B]">Total Product Amount</span>
            <span className="text-2xl font-black text-[#D96C2C]">₱{subtotal}</span>
          </div>
          <p className="mt-2 text-xs leading-5 text-[#555]">
            Delivery fee is shouldered by the customer unless eligible for free delivery.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default OrderSummary;