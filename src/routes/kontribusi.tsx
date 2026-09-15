import { createFileRoute } from "@tanstack/react-router";

import { absoluteUrl, siteConfig } from "@/config/site";

const description =
  "Halaman kontribusi — ucapan terima kasih kepada Nimzz, pembuat dan pengelola layanan Alight Motion Premium Creator.";

const socialLinks = [
  {
    label: "WhatsApp Channel",
    icon: "fa-brands fa-whatsapp",
    href: "https://whatsapp.com/channel/0029VbBhZWdGJP8HlbGaE63Q",
  },
  { label: "TikTok", icon: "fa-brands fa-tiktok", href: "https://tiktok.com/@nimzz_bocil_pokemon" },
  { label: "Telegram", icon: "fa-brands fa-telegram", href: "https://t.me/Nimzz4" },
  { label: "GitHub", icon: "fa-brands fa-github", href: "https://github.com/Nimzz-pemboy" },
];

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
          src="/banner.jpg"
          alt="Banner Nimzz"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="container-page -mt-16 flex flex-col items-center text-center">
        <img
          src="/avatar.jpg"
          alt="Avatar Nimzz"
          className="size-32 rounded-full border-2 border-border object-cover shadow-md sm:size-36"
          style={{ objectPosition: "50% 65%" }}
        />

        <h1 className="mt-5 text-3xl font-bold text-foreground sm:text-4xl">Nimzz</h1>
        <p className="mt-2 text-sm text-muted-foreground">Pembuat & Pengelola Layanan</p>

        <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Terima kasih sudah menggunakan {siteConfig.siteName}. Layanan ini dibangun, dirawat, dan
          dikembangkan sendiri oleh {siteConfig.author} di waktu luang — mulai dari sistem
          aktivasi, panduan, sampai dukungan lewat Nimzz AI. Dukungan dan kepercayaan kamu adalah
          alasan layanan ini terus berjalan.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-foreground">
            <i className="fa-solid fa-crown text-muted-foreground" aria-hidden="true" />
            Founder & Developer
          </span>
        </div>

        <div className="mt-10 w-full max-w-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Terhubung dengan Nimzz
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card px-3 py-4 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                <i className={`${link.icon} text-xl`} aria-hidden="true" />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
