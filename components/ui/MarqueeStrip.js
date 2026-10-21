/** Warm scriptural ribbon across the sanctuary banner. */
export default function MarqueeStrip() {
  return (
    <div
      className="marquee-strip service-strip"
      aria-label="Sanctuary pillars of worship"
    >
      <span>Rooted in the Living Word</span>
      <span aria-hidden="true">✦</span>
      <span>Seventh-Day Sabbath Rest</span>
      <span aria-hidden="true">✦</span>
      <span>Prayer &amp; Restoration</span>
      <span aria-hidden="true">✦</span>
      <span>Yeshua Hamashiach</span>
    </div>
  );
}
