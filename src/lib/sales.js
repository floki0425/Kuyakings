import { brand } from "./constants";

// An order counts as a confirmed sale once payment is actually in hand:
// either marked Paid (and not cancelled after the fact), or COD that has
// been delivered. Anything else (Pending, or COD still in transit) isn't
// counted yet.
export function isConfirmedSale(order) {
  if (order.payment_status === "Paid" && order.order_status !== "Cancelled") {
    return true;
  }

  if (order.payment_status === "COD" && order.order_status === "Delivered") {
    return true;
  }

  return false;
}

export function getOrderProfit(order) {
  if (!isConfirmedSale(order)) return 0;

  return Number(order.subtotal || 0) * brand.profitRate;
}

export function formatPeso(amount) {
  return `₱${Number(amount || 0).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
