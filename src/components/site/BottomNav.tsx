import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

const primaryItems = [
  { to: "/", label: "Beranda", icon: "fa-solid fa-compass" },
  { to: "/aktivasi", label: "Aktivasi", icon: "fa-solid fa-key" },
  { to: "/testimoni", label: "Testimoni", icon: "fa-solid fa-vector-square" },
] as const;

const menuItems = [
  { to: "/panduan", label: "Panduan Lengkap", icon: "fa-solid fa-book-open" },
  { to: "/troubleshooting", label: "Troubleshooting", icon: "fa-solid fa-screwdriver-wrench" },
  { to: "/faq", label: "Pertanyaan Umum (FAQ)", icon: "fa-solid fa-circle-question" },
  { to: "/status", label: "Status Gateway API", icon: "fa-solid fa-server" },
  { to: "/sistem", label: "Arsitektur Sistem", icon: "fa-solid fa-diagram-project" },
  { to: "/donasi", label: "Donasi Sukarela", icon: "fa-solid fa-hand-holding-heart" },
  { to: "/kontribusi", label: "Profil & Kontribusi", icon: "fa-solid fa-user-astronaut" },
] as const;

export function BottomNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useLocation({ select: (location) => location.pathname });

  const isMenuActive = menuItems.some((item) => item.to === pathname);

  return (
    <>
      <nav
        aria-label="Navigasi seluler"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-md lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="grid grid-cols-4">
          {primaryItems.map((item) => {
            const active = pathname === item.to;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`motion-press relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium whitespace-nowrap transition-colors ${
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {active && (
                    <span
                      className="absolute top-0 h-[2px] w-8 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                  )}
                  <i className={`${item.icon} text-sm`} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className={`motion-press relative flex w-full flex-col items-center gap-1 py-2.5 text-[11px] font-medium whitespace-nowrap transition-colors ${
                isMenuActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isMenuActive && (
                <span
                  className="absolute top-0 h-[2px] w-8 rounded-full bg-primary"
                  aria-hidden="true"
                />
              )}
              <i className="fa-solid fa-grip text-sm" aria-hidden="true" />
              <span>Lainnya</span>
            </button>
          </li>
        </ul>
      </nav>

      <div className="h-14 lg:hidden" aria-hidden="true" />

      <Drawer open={menuOpen} onOpenChange={setMenuOpen}>
        <DrawerContent className="lg:hidden">
          <DrawerHeader className="border-b border-border pb-3 text-left">
            <DrawerTitle className="font-display text-base">Direktori Halaman</DrawerTitle>
          </DrawerHeader>
          <ul className="divide-y divide-border/60 px-4 py-2 pb-6">
            {menuItems.map((item) => (
              <li key={item.to}>
                <DrawerClose asChild>
                  <Link
                    to={item.to}
                    className={`flex items-center justify-between py-3 text-sm font-medium transition-colors ${
                      pathname === item.to ? "text-primary" : "text-foreground hover:text-primary"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <i
                        className={`${item.icon} w-5 text-center text-muted-foreground`}
                        aria-hidden="true"
                      />
                      <span>{item.label}</span>
                    </span>
                    <i
                      className="fa-solid fa-arrow-Up-right-from-square text-xs text-muted-foreground/60"
                      aria-hidden="true"
                    />
                  </Link>
                </DrawerClose>
              </li>
            ))}
          </ul>
        </DrawerContent>
      </Drawer>
    </>
  );
}
