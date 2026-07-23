import { STATUS_STYLES } from "./StatusBadge";

function StatusSelect({ value, options, onChange, disabled }) {
  const colorStyle = STATUS_STYLES[value] || "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className={`w-full cursor-pointer rounded-full border px-3 py-1.5 text-xs font-black outline-none transition disabled:cursor-not-allowed disabled:opacity-60 ${colorStyle}`}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export default StatusSelect;
