import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { siteConfig } from "@/config/site";

const STORAGE_KEY = "amp-welcome-dismissed";

export function WelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let interacted = false;

    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      return;
    }

    const handleInteraction = () => {
      if (interacted) return;
      interacted = true;
      timer = setTimeout(() => {
        setOpen(true);
      }, 12000);
    };

    window.addEventListener("scroll", handleInteraction, { passive: true, once: true });
    window.addEventListener("pointerdown", handleInteraction, { passive: true, once: true });

    return () => {
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("pointerdown", handleInteraction);
      if (timer) clearTimeout(timer);
    };
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore storage errors
    }
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) dismiss();
      }}
    >
      <DialogContent className="max-w-md gap-0 overflow-hidden rounded-xl border border-border p-0">
        <div className="relative h-40 w-full bg-surface">
          <img
            src={siteConfig.thumbnail}
            alt="Ilustrasi Alight Motion Premium Creator"
            width={1280}
            height={800}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-6 flex items-center gap-3">
            <img
              src={siteConfig.logo}
              alt="Logo Alight Motion Creator"
              width={44}
              height={44}
              referrerPolicy="no-referrer"
              className="h-11 w-11 rounded-lg border border-white/20 object-cover shadow-md"
            />
            <div>
              <p className="font-mono text-[11px] text-white/80">INFORMASI LAYANAN</p>
              <p className="font-display text-sm font-semibold text-white">{siteConfig.siteName}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-left text-lg leading-snug">
              Utilitas Aktivasi Komunitas oleh Nimzz
            </DialogTitle>
            <DialogDescription className="space-y-2.5 pt-2 text-left text-sm leading-relaxed">
              <span className="block">
                Layanan ini dirancang sepenuhnya untuk penggunaan gratis dan dilarang keras untuk
                diperjualbelikan kembali.
              </span>
              <span className="block">
                Sistem ini bersifat unofficial serta tidak berafiliasi dengan pihak Alight Creative
                maupun Alight Motion.
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4 font-mono text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 text-foreground">
              <i className="fa-solid fa-check text-success" aria-hidden="true" />
              100% Gratis
            </span>
            <span aria-hidden="true">·</span>
            <span>Unofficial</span>
            <span aria-hidden="true">·</span>
            <span>Anti-Resale</span>
          </div>

          <div className="mt-6 flex gap-2.5">
            <DialogClose asChild>
              <Button asChild className="motion-press flex-1 gap-2">
                <Link to="/aktivasi">
                  <i className="fa-solid fa-bolt text-xs" aria-hidden="true" />
                  <span>Mulai Aktivasi</span>
                </Link>
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="outline" className="motion-press" onClick={dismiss}>
                Tutup
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
