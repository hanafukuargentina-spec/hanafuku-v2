const messages = [
  "🔥 ENVIOS A TODO EL PAIS",
  "⚡ ENVIO GRATIS A CABA EN 24HS",
  "✨ 15% OFF EN TU PRIMERA COMPRA",
  "🚀 NUEVOS DROPS CADA SEMANA",
  "🔥 ENVIOS A TODO EL PAIS",
  "⚡ ENVIO GRATIS A CABA EN 24HS",
  "✨ 15% OFF EN TU PRIMERA COMPRA",
  "🚀 NUEVOS DROPS CADA SEMANA",
];

export default function TopBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-accent h-8 flex items-center overflow-hidden">
      <div className="animate-marquee flex whitespace-nowrap">
        {messages.map((msg, i) => (
          <span
            key={i}
            className="text-[11px] sm:text-xs font-semibold text-background tracking-wide mx-8 sm:mx-12"
          >
            {msg}
          </span>
        ))}
      </div>
      <div className="animate-marquee2 flex whitespace-nowrap absolute">
        {messages.map((msg, i) => (
          <span
            key={i}
            className="text-[11px] sm:text-xs font-semibold text-background tracking-wide mx-8 sm:mx-12"
          >
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
