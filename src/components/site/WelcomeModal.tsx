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

const highlights = [
  { icon: "fa-solid fa-circle-check", text: "GRATIS" },
  { icon: "fa-solid fa-code-branch", text: "UNOFFICIAL" },
  { icon: "fa-solid fa-ban", text: "NOT FOR RESALE" },
];

export function WelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "1") setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) dismiss();
      }}
    >
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0">
        <div className="relative h-40 w-full">
          <img
            src={siteConfig.thumbnail}
            alt="Ilustrasi Alight Motion Premium Creator"
            width={1280}
            height={800}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/5 to-black/10" />
          <img
            src={siteConfig.logo}
            alt=""
            width={56}
            height={56}
            className="absolute -bottom-6 left-6 h-14 w-14 rounded-2xl border-4 border-background object-cover shadow-lift"
          />
        </div>

        <div className="px-6 pt-10 pb-6">
          <DialogHeader>
            <DialogTitle className="text-lg leading-snug">
              Selamat Datang di Alight Motion Premium Creator
            </DialogTitle>
            <DialogDescription className="space-y-3 pt-2 text-left">
              <span className="block">
                Layanan ini dibuat untuk penggunaan gratis dan bukan untuk diperjualbelikan.
              </span>
              <span className="block">
                Website ini merupakan layanan unofficial yang dibuat oleh Nimzz dan tidak
                berafiliasi dengan Alight Creative/Alight Motion.
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-wrap gap-2">
            {highlights.map((item) => (
              <span
                key={item.text}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold tracking-wide text-muted-foreground"
              >
                <i className={item.icon} aria-hidden="true" />
                {item.text}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <DialogClose asChild>
              <Button asChild className="w-full">
                <Link to="/aktivasi">
                  <i className="fa-solid fa-bolt" aria-hidden="true" />
                  Mulai Sekarang
                </Link>
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
