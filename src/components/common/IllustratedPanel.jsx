function IllustratedPanel({
  icon,
  label,
  caption,
  className = "",
  tone = "light",
  imageUrl,
  imageAlt = "",
  style,
}) {
  const toneStyles =
    tone === "dark"
      ? "bg-[#1d1f22] border-white/10"
      : "bg-[#F8E6E4] border-[#E8E1DE]";

  const iconWrapStyles =
    tone === "dark"
      ? "border-[#c91f3a]/40 bg-white/5 text-[#e2536b]"
      : "border-[#c91f3a]/30 bg-white text-[#c91f3a]";

  const labelStyles = tone === "dark" ? "text-white/45" : "text-[#8a8580]";

  if (imageUrl) {
    return (
      <div
        className={`kk-illustration relative overflow-hidden border ${toneStyles} ${className}`}
        style={style}
      >
        <img
          src={imageUrl}
          alt={imageAlt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`kk-illustration relative flex items-center justify-center overflow-hidden border ${toneStyles} ${className}`}
      style={style}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(23,25,28,0.05) 0 9px, transparent 9px 18px), repeating-linear-gradient(-45deg, rgba(23,25,28,0.05) 0 9px, transparent 9px 18px)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-xl border [&_svg]:h-7 [&_svg]:w-7 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.4] ${iconWrapStyles}`}
        >
          {icon}
        </div>

        {caption && (
          <p
            className={`font-serif text-base font-bold leading-snug ${
              tone === "dark" ? "text-white" : "text-[#17191c]"
            }`}
          >
            {caption}
          </p>
        )}

        {label && (
          <p
            className={`text-[0.65rem] font-black uppercase tracking-[0.2em] ${labelStyles}`}
          >
            {label}
          </p>
        )}
      </div>
    </div>
  );
}

export default IllustratedPanel;
