import { Link } from "@tanstack/react-router";

const primaryLinks = [
  { to: "/", label: "Beranda" },
  { to: "/aktivasi", label: "Aktivasi" },
  { to: "/testimoni", label: "Live Canvas Testimoni" },
  { to: "/panduan", label: "Panduan Lengkap" },
  { to: "/troubleshooting", label: "Troubleshooting" },
];

const secondaryLinks = [
  { to: "/faq", label: "FAQ" },
  { to: "/status", label: "Status API" },
  { to: "/sistem", label: "Arsitektur Sistem" },
  { to: "/donasi", label: "Donasi" },
  { to: "/kontribusi", label: "Kontribusi" },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-card">
      <div className="container-page py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-md">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img
                src="/images/logo.png"
                alt="Logo Alight Motion Premium Creator"
                width={30}
                height={30}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="h-7.5 w-7.5 rounded-lg border border-border object-cover"
              />
              <span className="font-display text-base font-semibold tracking-tight text-foreground">
                Alight Motion Premium Creator
              </span>
            </Link>
            <p className="mt-3.5 text-sm leading-relaxed text-muted-foreground">
              Utilitas komunitas independen untuk membantu proses aktivasi akun melalui verifikasi
              tautan email secara terpandu, aman, dan tanpa memerlukan kata sandi.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
              <span>Dibuat oleh Nimzz</span>
              <span aria-hidden="true">·</span>
              <span>Gratis</span>
              <span aria-hidden="true">·</span>
              <span>Unofficial</span>
              <span aria-hidden="true">·</span>
              <span>Tidak untuk Diperjualbelikan</span>
            </div>
          </div>

          <nav aria-label="Navigasi layanan">
            <p className="font-mono text-xs font-semibold text-foreground">ALUR &amp; PANDUAN</p>
            <ul className="mt-3.5 space-y-2.5 text-sm">
              {primaryLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Informasi dan dukungan">
            <p className="font-mono text-xs font-semibold text-foreground">
              INFORMASI &amp; DUKUNGAN
            </p>
            <ul className="mt-3.5 space-y-2.5 text-sm">
              {secondaryLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            Layanan komunitas independen oleh Nimzz. Tidak berafiliasi dengan Alight Creative Inc.
          </p>
          <p className="flex items-center gap-2 font-mono tabular-nums">
            <i className="fa-solid fa-shield-halved text-primary" aria-hidden="true" />
            <span>Zero-Credential Storage</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
