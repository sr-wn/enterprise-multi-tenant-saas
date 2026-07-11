function BrandLogo({ size = "var(--text-xl)", dotSize = 6 }) {
  return (
    <span
      className="inline-flex items-baseline text-primary font-semibold"
      style={{ fontSize: size, letterSpacing: "0.02em" }}
    >
      TENA
      <span
        className="rounded-full ml-0.5 self-end"
        style={{
          width: dotSize,
          height: dotSize,
          backgroundColor: "var(--color-accent-600)",
          marginBottom: "0.15em",
        }}
        aria-hidden="true"
      />
    </span>
  );
}

export default BrandLogo;
