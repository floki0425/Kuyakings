// Maps backend/network failures from order submission to customer-safe
// copy. Real error details (Supabase/Postgres messages, codes, stack
// traces) must never reach this file's callers beyond classification --
// keep those in console.error/logs only.

export const ORDER_ERROR_MESSAGES = {
  connection: {
    title: "Connection problem",
    explanation: "We're having trouble reaching our servers right now.",
    action: "Please check your internet connection and try again in a few moments.",
  },
  validation: {
    title: "Order could not be submitted",
    explanation: "Some of your order details couldn't be processed.",
    action: "Please review your information and try again.",
  },
  unavailable: {
    title: "Item no longer available",
    explanation: "Sorry, this product just became unavailable.",
    action: "Please choose a different flavor and try again.",
  },
  duplicate: {
    title: "Order already being processed",
    explanation:
      "It looks like we may have already received a recent order from this phone number.",
    action: "Please wait a few minutes and check your order status before trying again.",
  },
  payment: {
    title: "Proof of payment could not be saved",
    explanation:
      "We couldn't save your proof of payment image. Your order has not been submitted yet.",
    action: "Please try uploading your proof of payment again.",
  },
  general: {
    title: "Something went wrong",
    explanation: "We couldn't complete your order right now.",
    action: "Please review your details and try again.",
  },
};

// Classifies a Supabase/Postgres error (or a thrown network error) into one
// of the ORDER_ERROR_MESSAGES categories, without ever exposing the
// underlying technical message to the caller.
export function classifyOrderError(error) {
  if (!error) return "general";

  const code = error.code || "";
  const message = String(error.message || "").toLowerCase();

  const looksLikeNetworkError =
    error instanceof TypeError ||
    error.name === "AbortError" ||
    message.includes("failed to fetch") ||
    message.includes("network") ||
    message.includes("load failed") ||
    message.includes("timeout") ||
    message.includes("timed out");

  if (looksLikeNetworkError) return "connection";

  // Unique constraint on order_number: a retry landed on an order that
  // already exists, most likely because an earlier attempt actually
  // succeeded even though the customer never saw a confirmation.
  if (code === "23505") return "duplicate";

  // RLS with_check rejection. Every other field here is already
  // constrained by the UI before this request is ever sent, so the one
  // condition a real customer can legitimately trip is the per-phone rate
  // limit -- to the customer that reads as "you're going too fast", not
  // "your data is invalid".
  if (code === "42501" || message.includes("row-level security")) {
    return "duplicate";
  }

  if (code === "23514" || code === "23502" || message.includes("constraint")) {
    return "validation";
  }

  return "general";
}

// Builds the full customer-facing message for a category, including the
// reference ID the customer should quote if they contact support.
export function buildOrderErrorMessage(category, referenceId) {
  const entry = ORDER_ERROR_MESSAGES[category] || ORDER_ERROR_MESSAGES.general;

  return {
    title: entry.title,
    message: `${entry.explanation} ${entry.action}`,
    referenceId,
  };
}
