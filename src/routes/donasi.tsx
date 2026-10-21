import { createFileRoute } from "@tanstack/react-router";

import { DonationForm } from "@/components/site/DonationForm";
import { SectionIndex, SpotlightSurface } from "@/components/site/MotionPrimitives";
import { Button } from "@/components/ui/button";
import { buildPageSeo } from "@/config/site";

const description =
  "Dukung keberlanjutan server Alight Motion Premium Creator secara sukarela lewat QRIS. Scan atau unduh kode QR, lalu unggah bukti transfer.";

export const Route = createFileRoute("/donasi")({
  head: () =>
    buildPageSeo({
      title: "Donasi & Dukungan Server — Alight Motion Premium Creator",
      description,
      path: "/donasi",
    }),
  component: DonasiPage,
});

function DonasiPage() {
  return (
    <section className="container-page pt-10 pb-16 sm:pt-14">
      <div className="animate-fade-up border-b border-border pb-6">
        <SectionIndex
          index="DUKUNGAN KOMUNITAS"
          label="Kontribusi Sukarela Pemeliharaan Server"
          detail="QRIS"
        />
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Dukung Keberlanjutan Layanan</h1>
        <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Layanan ini disediakan secara gratis dan dikelola mandiri di waktu luang. Jika kamu merasa
          terbantu dan ingin memberikan apresiasi sukarela untuk pemeliharaan server, kamu dapat
          memindai kode QRIS di bawah ini.
        </p>
      </div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-12">
        <div className="animate-fade-up stagger-1 lg:col-span-5">
          <SpotlightSurface className="p-6" interactive={false}>
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="font-mono text-xs text-muted-foreground">METODE PEMBAYARAN</p>
                <h2 className="mt-1 text-lg font-semibold text-foreground">
                  Pindai Kode QRIS Resmi
                </h2>
              </div>
              <i className="fa-solid fa-qrcode text-lg text-primary" aria-hidden="true" />
            </div>

            <div className="mt-5 overflow-hidden rounded-lg border border-border bg-surface p-3">
              <img
                src="/qris.jpg"
                alt="QRIS Nimzz Store — pindai untuk donasi"
                referrerPolicy="no-referrer"
                className="w-full rounded object-contain"
              />
            </div>

            <a href="/qris.jpg" download="qris-nimzz.jpg" className="mt-4 block">
              <Button variant="outline" className="motion-press w-full gap-2">
                <i className="fa-solid fa-download text-xs" aria-hidden="true" />
                <span>Unduh Gambar QRIS</span>
              </Button>
            </a>
          </SpotlightSurface>
        </div>

        <div className="animate-fade-up stagger-2 lg:col-span-7">
          <div className="mb-4">
            <p className="font-mono text-xs text-muted-foreground">VERIFIKASI DUKUNGAN</p>
            <h2 className="mt-1 text-xl font-semibold text-foreground">
              Kirim Bukti Transfer Donasi
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Unggah tangkapan layar bukti transfer agar dukungan kamu tercatat dengan baik.
            </p>
          </div>
          <DonationForm />
        </div>
      </div>
    </section>
  );
}
