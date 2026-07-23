import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { brand } from "../../lib/constants";
import { supabase } from "../../lib/supabaseClient";
import { getFlavors, createOrder } from "../../lib/api.js";
import { usePaymentSettings } from "../../lib/usePaymentSettings";
import { useSpamGuard } from "../../lib/antiSpam";
import HoneypotField from "../common/HoneypotField";
import {
  createSecureImagePath,
  formatBytes,
  getImageAcceptAttribute,
  uploadLimits,
  validateImageFile,
} from "../../lib/uploadSecurity";
import OrderSummary from "./OrderSummary";

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="6" width="17" height="12" rx="2.2" />
      <path d="M3.5 10h17" />
      <circle cx="16" cy="14" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9.5 12 5l8 4.5" />
      <path d="M5 9.5v8M9.5 9.5v8M14.5 9.5v8M19 9.5v8" />
      <path d="M4 19.5h16" />
    </svg>
  );
}

function CashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="7" width="17" height="10" rx="1.6" />
      <circle cx="12" cy="12" r="2.4" />
    </svg>
  );
}

const paymentIcons = {
  GCash: <WalletIcon />,
  Maya: <WalletIcon />,
  "Bank Transfer": <BankIcon />,
  COD: <CashIcon />,
};

function StepHeader({ number, title }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#c91f3a] text-sm font-black text-white">
        {number}
      </span>
      <h2 className="font-serif text-xl font-bold text-[#17191C]">{title}</h2>
    </div>
  );
}

function PaymentQr({ url, label }) {
  if (!url) return null;

  return (
    <div className="mt-3">
      <img
        src={url}
        alt={`${label} QR code`}
        className="h-40 w-40 rounded-[0.85rem] border border-[#E8E1DE] bg-white object-contain p-2"
      />
      <p className="mt-1.5 text-xs text-[#8a8580]">Scan to pay via {label}.</p>
    </div>
  );
}

function OrderForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentSettings = usePaymentSettings();

  const [flavors, setFlavors] = useState([]);
  const [flavor, setFlavor] = useState("");
  const [isLoadingFlavors, setIsLoadingFlavors] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("GCash");
  const [deliveryOption, setDeliveryOption] = useState("Lalamove / Grab / Toktok");
  const [proofOfPayment, setProofOfPayment] = useState(null);
  const [proofError, setProofError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const { isSpam } = useSpamGuard();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    landmark: "",
    notes: "",
  });

  const selectedFlavor = flavors.find((item) => item.name === flavor);
  const pricePerPack = selectedFlavor?.price ?? brand.pricePerPack;
  const isBundle = flavor.toLowerCase().startsWith("bundle");
  const subtotal = quantity * pricePerPack;

  useEffect(() => {
    async function fetchFlavors() {
      const { data, error } = await getFlavors();

      if (error) {
        console.error("Fetch flavors error:", error);
        setSubmitError("Failed to load products. Please refresh the page.");
        setIsLoadingFlavors(false);
        return;
      }

      setFlavors(data || []);

      const requestedFlavor = searchParams.get("flavor");
      const requested = data?.find(
        (item) => item.name === requestedFlavor && item.is_available
      );
      const firstAvailable = data?.find((item) => item.is_available);
      const preselected = requested || firstAvailable;

      if (preselected) {
        setFlavor(preselected.name);
      }

      setIsLoadingFlavors(false);
    }

    fetchFlavors();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function increaseQuantity() {
    setQuantity((prev) => prev + 1);
  }

  function decreaseQuantity() {
    setQuantity((prev) => Math.max(1, prev - 1));
  }

  function handleProofChange(file) {
    setSubmitError("");
    setProofError("");

    if (!file) {
      setProofOfPayment(null);
      return;
    }

    const validation = validateImageFile(file, {
      label: "Proof of payment",
      maxBytes: uploadLimits.paymentProofBytes,
    });

    if (!validation.isValid) {
      setProofOfPayment(null);
      setProofError(validation.error);
      return;
    }

    setProofOfPayment(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSpam(honeypot)) {
      setSubmitError("Something went wrong. Please try again.");
      return;
    }

    if (!selectedFlavor || !selectedFlavor.is_available) {
      setSubmitError("Sorry, this product is currently sold out.");
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      setSubmitError("Please complete your name, phone number, address, and city.");
      return;
    }

    if (paymentMethod !== "COD" && !proofOfPayment) {
      setSubmitError("Please upload your proof of payment for GCash, Maya, or Bank Transfer.");
      return;
    }

    if (paymentMethod !== "COD" && proofError) {
      setSubmitError(proofError);
      return;
    }

    try {
      setIsSubmitting(true);

      const orderNumber = `KK-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

      let proofOfPaymentUrl = null;

      if (paymentMethod !== "COD" && proofOfPayment) {
        const filePath = createSecureImagePath("proofs", proofOfPayment);

        const { error: uploadError } = await supabase.storage
          .from("payment-proofs")
          .upload(filePath, proofOfPayment, {
            cacheControl: "3600",
            contentType: proofOfPayment.type,
            upsert: false,
          });

        if (uploadError) {
          console.error("Proof upload error:", uploadError);
          alert(`Proof of payment upload failed: ${uploadError.message}`);
          return;
        }

        proofOfPaymentUrl = filePath;
      }

      const newOrder = {
          order_number: orderNumber,
          product_name: brand.name,
          flavor,
          quantity,
          price_per_pack: pricePerPack,
          subtotal,
          payment_method: paymentMethod,
          delivery_option: deliveryOption,
          proof_of_payment_url: proofOfPaymentUrl,
          customer_name: formData.fullName,
          phone: formData.phone,
          email: formData.email || null,
          address: formData.address,
          city: formData.city,
          landmark: formData.landmark || null,
          notes: formData.notes || null,
        };

      const { data: orderData, error } = await createOrder(newOrder);

      console.log("New order payload:", newOrder);
      console.log("Create order response:", orderData, error);

      if (error) {
        setSubmitError(`Order failed: ${error.message}`);
        return;
      }

      localStorage.setItem(
        "latestOrder",
        JSON.stringify({
          ...newOrder,
          product_name: brand.name,
          price_per_pack: pricePerPack,
          subtotal,
          payment_status: paymentMethod === "COD" ? "COD" : "Pending",
          order_status: "New Order",
          created_at: new Date().toISOString(),
        })
      );

      navigate("/thank-you");
    } catch (err) {
      console.error("Unexpected order error:", err);
        setSubmitError(`Something went wrong: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-5 pb-14 min-[421px]:pb-20 lg:pb-24">
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <HoneypotField value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />

        <div className="space-y-6">
          <div className="rounded-lg border border-[#E8E1DE] bg-white p-6 sm:p-7">
            <StepHeader number="01" title="Choose Your Product" />

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-black text-[#17191C]">
                  Select Product
                </label>

                <select
                  value={flavor}
                  onChange={(e) => setFlavor(e.target.value)}
                  disabled={isLoadingFlavors || flavors.length === 0}
                  className="kk-input mt-2"
                >
                  {isLoadingFlavors ? (
                      <option value="">Loading products...</option>
                    ) : (
                      flavors.map((item) => (
                        <option
                          key={item.name}
                          value={item.name}
                          disabled={!item.is_available}
                        >
                          {item.name} — ₱{item.price}
                          {!item.is_available ? " — Sold Out" : ""}
                        </option>
                      ))
                    )}
                </select>
              </div>

              <div>
                <label className="text-sm font-black text-[#17191C]">
                  Quantity
                </label>

                <div className="mt-2 flex items-center overflow-hidden rounded-[0.85rem] border border-[#E8E1DE] bg-[#FFF7F2]">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    className="h-11 w-14 text-xl font-black text-[#17191C] transition hover:text-[#c91f3a]"
                  >
                    −
                  </button>

                  <div className="flex-1 text-center font-black text-[#17191C]">
                    {quantity}
                  </div>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    className="h-11 w-14 text-xl font-black text-[#17191C] transition hover:text-[#c91f3a]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {isBundle && (
              <p className="mt-4 rounded-[0.85rem] bg-[#F8E6E4] p-4 text-xs leading-5 text-[#17191C]">
                Each bundle includes 3 jars in any flavor mix. Tell us your
                flavor combination (e.g., 2 Original, 1 Spicy) in the Order
                Notes below.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-[#E8E1DE] bg-white p-6 sm:p-7">
            <StepHeader number="02" title="Delivery Details" />

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-black text-[#17191C]">
                  Full Name
                </label>

                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="kk-input mt-2"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="text-sm font-black text-[#17191C]">
                  Contact Number
                </label>

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="kk-input mt-2"
                  placeholder="09XXXXXXXXX"
                />
              </div>

              <div>
                <label className="text-sm font-black text-[#17191C]">
                  Email Address{" "}
                  <span className="font-normal text-[#8a8580]">(optional)</span>
                </label>

                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="kk-input mt-2"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="text-sm font-black text-[#17191C]">
                  City / Area
                </label>

                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="kk-input mt-2"
                  placeholder="Example: Quezon City"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-black text-[#17191C]">
                  Complete Address
                </label>

                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="kk-input mt-2"
                  placeholder="House no., street, barangay"
                />
              </div>

              <div>
                <label className="text-sm font-black text-[#17191C]">
                  Landmark{" "}
                  <span className="font-normal text-[#8a8580]">(optional)</span>
                </label>

                <input
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  className="kk-input mt-2"
                  placeholder="Near..."
                />
              </div>

              <div>
                <label className="text-sm font-black text-[#17191C]">
                  Delivery Option
                </label>

                <select
                  value={deliveryOption}
                  onChange={(e) => setDeliveryOption(e.target.value)}
                  className="kk-input mt-2"
                >
                  <option>Lalamove / Grab / Toktok</option>
                  <option>Shipping courier</option>
                  <option>Customer will book rider</option>
                  <option>To be confirmed by owner</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-black text-[#17191C]">
                  Order Notes{" "}
                  <span className="font-normal text-[#8a8580]">(optional)</span>
                </label>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  className="kk-input mt-2 resize-none"
                  placeholder="Example: mixed products, delivery instructions, preferred time..."
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[#E8E1DE] bg-white p-6 sm:p-7">
            <StepHeader number="03" title="Payment Method" />

            <div className="grid gap-3 sm:grid-cols-2">
              {["GCash", "Maya", "Bank Transfer", "COD"].map((method) => (
                <label
                  key={method}
                  className={`flex cursor-pointer items-center gap-3 rounded-[0.85rem] border p-4 transition ${
                    paymentMethod === method
                      ? "border-[#c91f3a] bg-[#F8E6E4]"
                      : "border-[#E8E1DE] bg-[#FFF7F2] hover:border-[#c91f3a]/40"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border [&_svg]:h-4 [&_svg]:w-4 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.6] ${
                      paymentMethod === method
                        ? "border-[#c91f3a] text-[#c91f3a]"
                        : "border-[#E8E1DE] text-[#8a8580]"
                    }`}
                  >
                    {paymentIcons[method]}
                  </span>

                  <span className="flex-1 font-black text-[#17191C]">{method}</span>

                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-[#c91f3a]"
                  />
                </label>
              ))}
            </div>

            {paymentMethod !== "COD" && (
              <div className="mt-6">
                <label className="text-sm font-black text-[#17191C]">
                  Upload Proof of Payment
                </label>

                <input
                  type="file"
                  accept={getImageAcceptAttribute()}
                  onChange={(e) => handleProofChange(e.target.files?.[0])}
                  className="kk-input mt-2"
                />

                <p className="mt-2 text-xs leading-5 text-[#5F5B58]">
                  Required for GCash, Maya, and Bank Transfer. JPG, PNG, or WebP up to{" "}
                  {formatBytes(uploadLimits.paymentProofBytes)}.
                </p>

                {proofError && (
                  <p className="mt-2 text-sm font-bold text-red-700">
                    {proofError}
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 rounded-[0.85rem] bg-[#FFF7F2] p-4 text-sm leading-6 text-[#5F5B58]">
              {paymentMethod === "GCash" && (
                <div>
                  <p className="font-black text-[#17191C]">GCash Payment Details</p>
                  {paymentSettings.gcash.account_name && paymentSettings.gcash.account_number ? (
                    <>
                      <p>Name: {paymentSettings.gcash.account_name}</p>
                      <p>Number: {paymentSettings.gcash.account_number}</p>
                    </>
                  ) : (
                    <p>
                      Payment details aren&apos;t set up yet. Please contact
                      us before sending payment.
                    </p>
                  )}
                  <PaymentQr url={paymentSettings.gcash.qr_code_url} label="GCash" />
                </div>
              )}

              {paymentMethod === "Maya" && (
                <div>
                  <p className="font-black text-[#17191C]">Maya Payment Details</p>
                  {paymentSettings.maya.account_name && paymentSettings.maya.account_number ? (
                    <>
                      <p>Name: {paymentSettings.maya.account_name}</p>
                      <p>Number: {paymentSettings.maya.account_number}</p>
                    </>
                  ) : (
                    <p>
                      Payment details aren&apos;t set up yet. Please contact
                      us before sending payment.
                    </p>
                  )}
                  <PaymentQr url={paymentSettings.maya.qr_code_url} label="Maya" />
                </div>
              )}

              {paymentMethod === "Bank Transfer" && (
                <div>
                  <p className="font-black text-[#17191C]">Bank Transfer Details</p>
                  {paymentSettings.bank.bank_name && paymentSettings.bank.account_number ? (
                    <>
                      <p>Bank: {paymentSettings.bank.bank_name}</p>
                      <p>Account Name: {paymentSettings.bank.account_name}</p>
                      <p>Account Number: {paymentSettings.bank.account_number}</p>
                    </>
                  ) : (
                    <p>
                      Payment details aren&apos;t set up yet. Please contact
                      us before sending payment.
                    </p>
                  )}
                  <PaymentQr url={paymentSettings.bank.qr_code_url} label="Bank Transfer" />
                </div>
              )}

              {paymentMethod === "COD" && (
                <div>
                  <p className="font-black text-[#17191C]">Cash on Delivery</p>
                  <p>The owner will confirm if COD is available for your area.</p>
                </div>
              )}
            </div>

              {submitError && (
                <div className="mt-6 rounded-[0.85rem] border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-700">
                  {submitError}
                </div>
              )}

            <button
              type="submit"
              disabled={isSubmitting || isLoadingFlavors || !flavor}
              className="mt-7 w-full rounded-full bg-[#c91f3a] px-7 py-4 font-black text-white transition hover:-translate-y-0.5 hover:bg-[#a61930] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isSubmitting ? "Submitting Order..." : "Place Order"}
            </button>
          </div>
        </div>

        <OrderSummary
          flavor={flavor}
          quantity={quantity}
          paymentMethod={paymentMethod}
          pricePerPack={pricePerPack}
        />
      </form>
    </section>
  );
}

export default OrderForm;
