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

const STORAGE_KEY = "amp-welcome-dismissed";

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
        <img
          src="/images/thumbnail.png"
          alt="Ilustrasi Alight Motion Premium Creator"
          width={1280}
          height={800}
          className="h-36 w-full border-b border-border object-cover"
        />
        <div className="p-6">
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

          <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Gratis • Unofficial • Not for Resale
          </p>

          <div className="mt-6">
            <DialogClose asChild>
              <Button asChild className="w-full">
                <Link to="/aktivasi">Mulai Sekarang</Link>
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
