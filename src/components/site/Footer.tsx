import { Link } from "@tanstack/react-router";

const links = [
  { to: "/panduan", label: "Panduan" },
  { to: "/faq", label: "FAQ" },
  { to: "/troubleshooting", label: "Troubleshooting" },
  { to: "/status", label: "API Status" },
  { to: "/sistem", label: "Tentang Sistem" },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="container-page flex flex-col gap-8 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/logo.png"
              alt="Logo Alight Motion Premium Creator"
              width={32}
              height={32}
              loading="lazy"
              className="h-8 w-8 rounded-lg"
            />
            <span className="font-semibold">Alight Motion Premium Creator</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Created by Nimzz</p>
          <p className="mt-1 text-sm text-muted-foreground">Free • Unofficial • Not for Resale</p>
        </div>

        <nav aria-label="Tautan footer">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-1">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="container-page border-t border-border py-6 text-xs leading-relaxed text-muted-foreground">
        Layanan unofficial oleh Nimzz. Tidak berafiliasi dengan Alight Creative / Alight Motion.
      </div>
    </footer>
  );
}
