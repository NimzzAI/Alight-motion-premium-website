import { Link } from "@tanstack/react-router";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Beranda" },
  { to: "/aktivasi", label: "Aktivasi" },
  { to: "/testimoni", label: "Testimoni" },
  { to: "/panduan", label: "Panduan" },
  { to: "/troubleshooting", label: "Bantuan" },
  { to: "/status", label: "Status" },
  { to: "/donasi", label: "Donasi" },
  { to: "/kontribusi", label: "Kontribusi" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-2.5 whitespace-nowrap"
          onClick={() => setOpen(false)}
        >
          <img
            src="/images/logo.png"
            alt="Logo Alight Motion Premium Creator"
            width={30}
            height={30}
            referrerPolicy="no-referrer"
            className="h-7.5 w-7.5 rounded-lg border border-border object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <span className="font-display text-base font-semibold tracking-tight text-foreground">
            Alight Motion Creator
          </span>
        </Link>

        {/* Zone 2: Clean Single-Line Text Navigation Links */}
        <nav aria-label="Navigasi utama" className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="relative shrink-0 py-1 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors duration-150 after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 hover:text-foreground hover:after:scale-x-100 data-[status=active]:text-foreground data-[status=active]:after:scale-x-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex shrink-0 items-center gap-3">
          <Link
            to="/aktivasi"
            className="motion-press hidden items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold whitespace-nowrap text-primary-foreground shadow-2xs hover:bg-primary/92 sm:inline-flex"
          >
            <span>Mulai Aktivasi</span>
            <i className="fa-solid fa-arrow-right text-[11px]" aria-hidden="true" />
          </Link>

          <button
            type="button"
            className="motion-press inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-surface lg:hidden"
            aria-label={open ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <i
              className={open ? "fa-solid fa-xmark text-sm" : "fa-solid fa-bars text-sm"}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 top-16 z-30 bg-black/25 backdrop-blur-xs lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="animate-step-enter relative z-40 border-t border-border bg-card lg:hidden">
            <ul className="container-page divide-y divide-border/60 py-2">
              {navItems.map((item, idx) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:font-semibold data-[status=active]:text-primary"
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-xs text-muted-foreground/70 tabular-nums">
                        0{idx + 1}
                      </span>
                      <span>{item.label}</span>
                    </span>
                    <i
                      className="fa-solid fa-chevron-right text-[11px] text-muted-foreground/60"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
              <li className="pt-3 pb-2">
                <Link
                  to="/aktivasi"
                  onClick={() => setOpen(false)}
                  className="motion-press flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  <span>Mulai Aktivasi</span>
                  <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>
        </>
      )}
    </header>
  );
}
