import { createFileRoute } from "@tanstack/react-router";

import { absoluteUrl, siteConfig } from "@/config/site";

const description =
  "Halaman kontribusi — ucapan terima kasih kepada Nimzz, pembuat dan pengelola layanan Alight Motion Premium Creator.";

export const Route = createFileRoute("/kontribusi")({
  head: () => ({
    meta: [
      { title: "Kontribusi — Alight Motion Premium Creator" },
      { name: "description", content: description },
      { property: "og:title", content: "Kontribusi — Alight Motion Premium Creator" },
      { property: "og:description", content: description },
      { property: "og:url", content: absoluteUrl("/kontribusi") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/kontribusi") }],
  }),
  component: KontribusiPage,
});

function KontribusiPage() {
  return (
    <section className="pb-16">
      <div className="relative h-48 w-full overflow-hidden sm:h-64">
        <img
          src="/images/thumbnail.png"
          alt="Banner Nimzz"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="container-page -mt-16 flex flex-col items-center text-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-400 blur-md opacity-80" />
          <img
            src="/images/logo.png"
            alt="Avatar Nimzz"
            className="relative size-32 rounded-full border-4 border-amber-300 object-cover shadow-[0_0_24px_rgba(251,191,36,0.55)] sm:size-36"
          />
        </div>

        <h1 className="gold-shimmer mt-5 text-3xl font-bold sm:text-4xl">Nimzz</h1>
        <p className="mt-2 text-sm text-muted-foreground">Pembuat & Pengelola Layanan</p>

        <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Terima kasih sudah menggunakan {siteConfig.siteName}. Layanan ini dibangun, dirawat, dan
          dikembangkan sendiri oleh {siteConfig.author} di waktu luang — mulai dari sistem
          aktivasi, panduan, sampai dukungan lewat Nimzz AI. Dukungan dan kepercayaan kamu adalah
          alasan layanan ini terus berjalan.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-1.5 text-xs font-medium text-amber-600 dark:text-amber-300">
            <i className="fa-solid fa-crown" aria-hidden="true" />
            Founder & Developer
          </span>
        </div>
      </div>

      <style>{`
        .gold-shimmer {
          background: linear-gradient(
            90deg,
            #b8860b 0%,
            #fde68a 25%,
            #fffbe0 50%,
            #fde68a 75%,
            #b8860b 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: gold-shimmer-move 3.5s linear infinite;
        }
        @keyframes gold-shimmer-move {
          0% {
            background-position: 200% center;
          }
          100% {
            background-position: -200% center;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .gold-shimmer {
            animation: none;
            background-position: 0% center;
          }
        }
      `}</style>
    </section>
  );
}
