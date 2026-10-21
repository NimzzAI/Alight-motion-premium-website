import { Link, createFileRoute } from "@tanstack/react-router";

import { ActivationFlow } from "@/components/site/ActivationFlow";
import { AfterSuccess } from "@/components/site/AfterSuccess";
import { ApiStatusDot } from "@/components/site/ApiStatusDot";
import { SectionIndex, SpotlightSurface } from "@/components/site/MotionPrimitives";
import { Button } from "@/components/ui/button";
import { buildPageSeo } from "@/config/site";

const description =
  "Aktivasi Alight Motion Premium langkah demi langkah: masukkan email, kirim link, salin magic link, lalu verifikasi instan.";

export const Route = createFileRoute("/aktivasi")({
  head: () =>
    buildPageSeo({
      title: "Aktivasi Akun — Alight Motion Premium Creator",
      description,
      path: "/aktivasi",
    }),
  component: AktivasiPage,
});

const sideTips = [
  {
    icon: "fa-solid fa-triangle-exclamation",
    title: "Cek Folder Spam",
    desc: "Lebih dari 80% email verifikasi masuk ke folder Spam di Gmail, bukan kotak masuk utama.",
  },
  {
    icon: "fa-solid fa-hand-pointer",
    title: "Tahan & Salin URL",
    desc: "Jangan klik tautan biru secara langsung. Tahan tulisan 'Sign in to Alight Creative' lalu pilih Salin URL.",
  },
  {
    icon: "fa-regular fa-clock",
    title: "Batas Waktu 5 Menit",
    desc: "Setiap tautan hanya berlaku 5 menit sejak dikirim. Jika kedaluwarsa, cukup kirim ulang tautan baru.",
  },
];

function AktivasiPage() {
  return (
    <>
      <section className="container-page pt-10 pb-8 sm:pt-14">
        <div className="animate-fade-up flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <SectionIndex index="WORKSPACE" label="Konsol Aktivasi Mandiri" detail="5 Tahap" />
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Aktivasi Akun</h1>
            <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Ikuti kelima tahapan di bawah secara berurutan. Progres tahapan kamu tersimpan
              otomatis saat kamu berpindah ke aplikasi Gmail untuk menyalin tautan.
            </p>
          </div>
          <ApiStatusDot />
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-12">
          <div className="animate-fade-up stagger-1 lg:col-span-8">
            <ActivationFlow />
          </div>

          <aside className="animate-fade-up stagger-2 space-y-4 lg:col-span-4">
            <SpotlightSurface className="p-5" interactive={false}>
              <h2 className="flex items-center gap-2 font-mono text-xs font-semibold text-foreground">
                <i className="fa-solid fa-lightbulb text-primary" aria-hidden="true" />
                <span>CATATAN PENTING</span>
              </h2>
              <ul className="mt-4 divide-y divide-border/70">
                {sideTips.map((tip) => (
                  <li key={tip.title} className="py-3 first:pt-0 last:pb-0">
                    <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
                      <i className={`${tip.icon} text-primary`} aria-hidden="true" />
                      <span>{tip.title}</span>
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{tip.desc}</p>
                  </li>
                ))}
              </ul>
            </SpotlightSurface>

            <div className="grid grid-cols-2 gap-2.5">
              <Button asChild variant="outline" className="motion-press w-full gap-2 text-xs">
                <Link to="/panduan">
                  <i className="fa-solid fa-book-open text-xs" aria-hidden="true" />
                  <span>Panduan Gambar</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="motion-press w-full gap-2 text-xs">
                <Link to="/troubleshooting">
                  <i className="fa-solid fa-screwdriver-wrench text-xs" aria-hidden="true" />
                  <span>Solusi Error</span>
                </Link>
              </Button>
            </div>
          </aside>
        </div>
      </section>

      <AfterSuccess />
    </>
  );
}
