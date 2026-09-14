import { createFileRoute } from "@tanstack/react-router";

import { DonationForm } from "@/components/site/DonationForm";
import { Button } from "@/components/ui/button";
import { absoluteUrl } from "@/config/site";

const description =
  "Dukung layanan Alight Motion Premium Creator secara sukarela lewat QRIS. Scan atau unduh QR, lalu kirim bukti transfer.";

export const Route = createFileRoute("/donasi")({
  head: () => ({
    meta: [
      { title: "Donasi — Alight Motion Premium Creator" },
      { name: "description", content: description },
      { property: "og:title", content: "Donasi — Alight Motion Premium Creator" },
      { property: "og:description", content: description },
      { property: "og:url", content: absoluteUrl("/donasi") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/donasi") }],
  }),
  component: DonasiPage,
});

function DonasiPage() {
  return (
    <section className="container-page pt-12 pb-16">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-3xl font-semibold sm:text-4xl">Donasi 💖</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Layanan ini gratis dan dirawat sendiri di waktu luang. Kalau kamu merasa terbantu dan
          ingin traktir Nimzz kopi atau sekadar kasih semangat, donasi lewat QRIS di bawah ini
          bakal sangat berarti. Setiap dukungan, sekecil apa pun, bikin layanan ini bisa terus
          hidup untuk kamu dan yang lain. Makasih sebelumnya! 🥰
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-sm">
        <img
          src="/qris.jpg"
          alt="QRIS Nimzz Store — scan untuk donasi"
          className="w-full rounded-lg border border-border"
        />
        <a href="/qris.jpg" download="qris-nimzz.jpg" className="mt-4 block">
          <Button variant="outline" className="w-full gap-2">
            <i className="fa-solid fa-download" aria-hidden="true" />
            Unduh QRIS
          </Button>
        </a>
      </div>

      <div className="mx-auto mt-10 max-w-sm">
        <h2 className="text-center text-lg font-semibold text-foreground">
          Kirim Bukti Transfer
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Unggah screenshot atau foto bukti transfer di bawah ini.
        </p>
        <div className="mt-5">
          <DonationForm />
        </div>
      </div>
    </section>
  );
}
