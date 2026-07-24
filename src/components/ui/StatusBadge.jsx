export const STATUS_STYLES = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Paid: "bg-green-100 text-green-800 border-green-200",
  COD: "bg-blue-100 text-blue-800 border-blue-200",
  Cancelled: "bg-red-100 text-red-800 border-red-200",

  "New Order": "bg-gray-100 text-gray-800 border-gray-200",
  Confirmed: "bg-green-100 text-green-800 border-green-200",
  Preparing: "bg-orange-100 text-orange-800 border-orange-200",
  "Shipped / Out for Delivery": "bg-blue-100 text-blue-800 border-blue-200",
  Delivered: "bg-green-100 text-green-800 border-green-200",
};

function StatusBadge({ status }) {
  const badgeStyle =
    STATUS_STYLES[status] || "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <span
      className={`inline-flex items-center rounded-xl border px-3 py-1 text-xs font-black ${badgeStyle}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;