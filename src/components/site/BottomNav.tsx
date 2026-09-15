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
  { to: "/", label: "Beranda", icon: "fa-solid fa-house" },
  { to: "/aktivasi", label: "Aktivasi", icon: "fa-solid fa-key" },
  { to: "/donasi", label: "Donasi", icon: "fa-solid fa-heart" },
] as const;

const menuItems = [
  { to: "/panduan", label: "Panduan", icon: "fa-solid fa-book-open" },
  { to: "/faq", label: "FAQ", icon: "fa-solid fa-circle-question" },
  { to: "/troubleshooting", label: "Troubleshooting", icon: "fa-solid fa-screwdriver-wrench" },
  { to: "/status", label: "API Status", icon: "fa-solid fa-server" },
  { to: "/sistem", label: "Tentang Sistem", icon: "fa-solid fa-gears" },
  { to: "/kontribusi", label: "Kontribusi", icon: "fa-solid fa-star" },
] as const;

export function BottomNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useLocation({ select: (location) => location.pathname });

  const isMenuActive = menuItems.some((item) => item.to === pathname);

  return (
    <>
      <nav
        aria-label="Navigasi utama"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="grid grid-cols-4">
          {primaryItems.map((item) => {
            const active = pathname === item.to;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <i className={`${item.icon} text-base`} aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              onClick={() => setMenuOpen(true)}
              className={`flex w-full flex-col items-center gap-0.5 py-2.5 text-[11px] ${
                isMenuActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <i className="fa-solid fa-bars text-base" aria-hidden="true" />
              Menu
            </button>
          </li>
        </ul>
      </nav>

      {/* Spacer supaya konten halaman tidak tertutup bottom nav di layar kecil */}
      <div className="h-16 lg:hidden" aria-hidden="true" />

      <Drawer open={menuOpen} onOpenChange={setMenuOpen}>
        <DrawerContent className="lg:hidden">
          <DrawerHeader>
            <DrawerTitle>Menu Lainnya</DrawerTitle>
          </DrawerHeader>
          <ul className="space-y-1 px-4 pb-6">
            {menuItems.map((item) => (
              <li key={item.to}>
                <DrawerClose asChild>
                  <Link
                    to={item.to}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                      pathname === item.to
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <i className={`${item.icon} w-4 text-center`} aria-hidden="true" />
                    {item.label}
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
