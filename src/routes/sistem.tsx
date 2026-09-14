import { createFileRoute } from "@tanstack/react-router";

import { Disclaimer } from "@/components/site/Disclaimer";
import { absoluteUrl } from "@/config/site";

const description =
  "Penjelasan sederhana cara kerja website: website ini hanya menghubungkan kamu dengan API layanan aktivasi.";

export const Route = createFileRoute("/sistem")({
  head: () => ({
    meta: [
      { title: "Tentang Sistem — Alight Motion Premium Creator" },
      { name: "description", content: description },
      { property: "og:title", content: "Tentang Sistem — Alight Motion Premium Creator" },
      { property: "og:description", content: description },
      { property: "og:url", content: absoluteUrl("/sistem") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/sistem") }],
  }),
  component: SistemPage,
});

function SistemPage() {
  return (
    <>
      <section className="container-page pt-12">
        <h1 className="text-3xl font-semibold sm:text-4xl">Tentang Sistem</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Website ini hanya bagian tampilan. Semua proses pengiriman email dan verifikasi dilakukan
          oleh API yang sudah tersedia. Website tidak menyimpan atau menampilkan credential apa pun.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Alur sistem</h2>
            <pre className="mt-4 rounded-xl border border-border bg-surface p-5 font-sans text-sm leading-loose text-muted-foreground">
              {`User
 ↓
Website
 ↓
Alight Motion API
 ↓
External Services`}
            </pre>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Yang perlu kamu tahu</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li className="flex gap-2.5">
                <i className="fa-solid fa-lock mt-1 text-primary" aria-hidden="true" />
                Website tidak pernah menampilkan token, secret, atau data internal.
              </li>
              <li className="flex gap-2.5">
                <i className="fa-solid fa-shield-halved mt-1 text-primary" aria-hidden="true" />
                Website tidak meminta password akun kamu.
              </li>
              <li className="flex gap-2.5">
                <i className="fa-solid fa-plug-circle-bolt mt-1 text-primary" aria-hidden="true" />
                Jika API sedang offline, seluruh proses aktivasi ikut tidak tersedia.
              </li>
              <li className="flex gap-2.5">
                <i className="fa-solid fa-clock-rotate-left mt-1 text-primary" aria-hidden="true" />
                Kecepatan email masuk bergantung pada layanan email pihak ketiga.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Disclaimer />
    </>
  );
}
