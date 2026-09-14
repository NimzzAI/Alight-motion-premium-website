import { Link, createFileRoute } from "@tanstack/react-router";

import { ActivationFlow } from "@/components/site/ActivationFlow";
import { AfterSuccess } from "@/components/site/AfterSuccess";
import { ApiStatusDot } from "@/components/site/ApiStatusDot";
import { Button } from "@/components/ui/button";
import { absoluteUrl } from "@/config/site";

const description =
  "Aktivasi Alight Motion Premium langkah demi langkah: masukkan email, kirim link, salin magic link, lalu verifikasi.";

export const Route = createFileRoute("/aktivasi")({
  head: () => ({
    meta: [
      { title: "Aktivasi — Alight Motion Premium Creator" },
      { name: "description", content: description },
      { property: "og:title", content: "Aktivasi — Alight Motion Premium Creator" },
      { property: "og:description", content: description },
      { property: "og:url", content: absoluteUrl("/aktivasi") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/aktivasi") }],
  }),
  component: AktivasiPage,
});

function AktivasiPage() {
  return (
    <>
      <section className="container-page pt-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Aktivasi</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Ikuti step berikut satu per satu. Jika ada yang membingungkan, buka panduan lengkap
              atau halaman troubleshooting.
            </p>
          </div>
          <ApiStatusDot />
        </div>

        <div className="mt-8">
          <ActivationFlow />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link to="/panduan">Panduan Lengkap</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/troubleshooting">Mengalami Masalah?</Link>
          </Button>
        </div>
      </section>

      <AfterSuccess />
    </>
  );
}
