import { createFileRoute } from "@tanstack/react-router";

import { SectionIndex, SpotlightSurface } from "@/components/site/MotionPrimitives";
import { buildPageSeo, siteConfig } from "@/config/site";

const description =
  "Profil pengembang & halaman kontribusi Nimzz — pembuat dan pengelola layanan komunitas Alight Motion Premium Creator.";

const socialLinks = [
  {
    label: "Saluran WhatsApp",
    handle: "Update & Info Layanan",
    icon: "fa-brands fa-whatsapp",
    href: "https://whatsapp.com/channel/0029VbBhZWdGJP8HlbGaE63Q",
  },
  {
    label: "TikTok",
    handle: "@nimzz_bocil_pokemon",
    icon: "fa-brands fa-tiktok",
    href: "https://tiktok.com/@nimzz_bocil_pokemon",
  },
  {
    label: "Telegram",
    handle: "@Nimzz4",
    icon: "fa-brands fa-telegram",
    href: "https://t.me/Nimzz4",
  },
  {
    label: "GitHub",
    handle: "Nimzz-pemboy",
    icon: "fa-brands fa-github",
    href: "https://github.com/Nimzz-pemboy",
  },
];

export const Route = createFileRoute("/kontribusi")({
  head: () =>
    buildPageSeo({
      title: "Profil & Kontribusi Nimzz — Alight Motion Premium Creator",
      description,
      path: "/kontribusi",
    }),
  component: KontribusiPage,
});

function KontribusiPage() {
  return (
    <section className="container-page pt-10 pb-16 sm:pt-14">
      <div className="animate-fade-up overflow-hidden rounded-xl border border-border bg-card shadow-soft">
        <div className="relative h-48 w-full overflow-hidden bg-surface sm:h-64">
          <img
            src="/banner.jpg"
            alt="Banner profil Nimzz"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
          <div className="absolute right-6 bottom-4 hidden font-mono text-xs text-white/80 sm:block">
            PENGEMBANG &amp; PENGELOLA UTAMA
          </div>
        </div>

        <div className="px-6 pb-8 sm:px-10 sm:pb-10">
          <div className="relative -mt-14 flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="relative h-28 w-28 overflow-hidden rounded-xl border-4 border-card bg-surface shadow-md">
              <img
                src="/avatar.jpg"
                alt="Avatar Nimzz"
                width={736}
                height={736}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 text-foreground">
                <i className="fa-solid fa-code text-primary" aria-hidden="true" />
                Founder &amp; Developer
              </span>
              <span aria-hidden="true">·</span>
              <span>Inisiatif Komunitas</span>
              <span aria-hidden="true">·</span>
              <span>100% Gratis</span>
            </div>
          </div>

          <div className="mt-6 max-w-2xl">
            <SectionIndex index="PROFIL KREATOR" label="Pembuat & Pengelola Layanan" />
            <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">Nimzz</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Terima kasih telah menggunakan {siteConfig.siteName}. Seluruh infrastruktur halaman
              ini — mulai dari alur aktivasi terpandu, dokumentasi pemula, hingga integrasi asisten
              Nimzz AI — dirancang dan dirawat secara independen oleh {siteConfig.author} untuk
              mempermudah komunitas kreator.
            </p>
          </div>
        </div>
      </div>

      <div className="animate-fade-up stagger-2 mt-8">
        <div className="mb-4">
          <p className="font-mono text-xs text-muted-foreground">JEJARING RESMI</p>
          <h2 className="mt-1 text-xl font-semibold text-foreground">Terhubung dengan Nimzz</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <SpotlightSurface className="flex h-full flex-col justify-between p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
                    <i className={`${link.icon} text-lg`} aria-hidden="true" />
                  </div>
                  <i
                    className="fa-solid fa-arrow-up-right-from-square text-xs text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-5">
                  <p className="text-sm font-semibold text-foreground">{link.label}</p>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">{link.handle}</p>
                </div>
              </SpotlightSurface>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
