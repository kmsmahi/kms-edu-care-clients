/** Consistent section heading used across all pages. */
const SectionHeading = ({ eyebrow, title, subtitle, align = "center" }) => {
  const alignment = align === "left" ? "text-left" : "text-center mx-auto";

  return (
    <div className={`mb-10 max-w-2xl ${alignment}`}>
      {eyebrow && (
        <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-widest text-teal">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-bold text-navy md:text-4xl">{title}</h2>
      {/* Brand accent underline */}
      <div
        className={`mt-3 h-1 w-16 rounded-full bg-teal ${
          align === "left" ? "" : "mx-auto"
        }`}
      />
      {subtitle && <p className="mt-4 text-slate-600">{subtitle}</p>}
    </div>
  );
};

export default SectionHeading;