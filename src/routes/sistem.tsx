import { createFileRoute } from "@tanstack/react-router";

import { Disclaimer } from "@/components/site/Disclaimer";
import {
  Reveal,
  SectionIndex,
  SignalPipeline,
  SpotlightSurface,
} from "@/components/site/MotionPrimitives";
import { buildPageSeo } from "@/config/site";

const description =
  "Arsitektur dan keamanan sistem Alight Motion Premium Creator: mekanisme jembatan API server-side tanpa menyimpan kredensial atau token pengguna.";

export const Route = createFileRoute("/sistem")({
  head: () =>
    buildPageSeo({
      title: "Tentang Sistem & Arsitektur — Alight Motion Premium Creator",
      description,
      path: "/sistem",
    }),
  component: SistemPage,
});

const principles = [
  {
    num: "01",
    icon: "fa-solid fa-lock",
    title: "Tanpa Token & Data Internal",
    desc: "Website tidak pernah menampilkan token, secret, atau data internal.",
  },
  {
    num: "02",
    icon: "fa-solid fa-shield-halved",
    title: "Tanpa Password Akun",
    desc: "Website tidak meminta password akun kamu.",
  },
  {
    num: "03",
    icon: "fa-solid fa-plug-circle-bolt",
    title: "Bergantung Status API",
    desc: "Jika API sedang offline, seluruh proses aktivasi ikut tidak tersedia.",
  },
  {
    num: "04",
    icon: "fa-solid fa-clock-rotate-left",
    title: "Layanan Email Pihak Ketiga",
    desc: "Kecepatan email masuk bergantung pada layanan email pihak ketiga.",
  },
];

function SistemPage() {
  return (
    <>
      <section className="container-page pt-10 pb-6 sm:pt-14">
        <div className="animate-fade-up border-b border-border pb-6">
          <SectionIndex index="SISTEM" label="Cara Kerja Website" />
          <h1 className="mt-2.5 text-3xl font-semibold sm:text-4xl">Tentang Sistem</h1>
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Website ini hanya bagian tampilan. Semua proses pengiriman email dan verifikasi
            dilakukan oleh API yang sudah tersedia. Website tidak menyimpan atau menampilkan
            credential apa pun.
          </p>
        </div>

        <Reveal className="mt-8">
          <SignalPipeline />
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {principles.map((p, idx) => (
            <Reveal key={p.num} delay={idx * 80}>
              <SpotlightSurface className="h-full p-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-primary tabular-nums">
                    {p.num}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-primary">
                    <i className={`${p.icon} text-xs`} aria-hidden="true" />
                  </div>
                </div>
                <h2 className="mt-4 text-base font-semibold text-foreground">{p.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </SpotlightSurface>
            </Reveal>
          ))}
        </div>
      </section>

      <Disclaimer />
    </>
  );
}
