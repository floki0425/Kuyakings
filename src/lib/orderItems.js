// Shared helpers for reading an order's line items. Orders placed before
// multi-flavor support was added have no `items` array (or an empty one),
// so every reader falls back to a single synthesized item built from the
// legacy flat flavor/quantity/price_per_pack/subtotal columns.

export function getOrderLineItems(order) {
  if (Array.isArray(order?.items) && order.items.length > 0) {
    return order.items;
  }

  return [
    {
      flavor: order?.flavor || order?.product_name || "N/A",
      quantity: Number(order?.quantity || 0),
      price_per_pack: Number(order?.price_per_pack || 0),
      subtotal: Number(order?.subtotal || 0),
    },
  ];
}

export function summarizeFlavors(order) {
  return getOrderLineItems(order)
    .map((item) => item.flavor)
    .join(", ");
}
