import { Link, createFileRoute } from "@tanstack/react-router";

import { AfterSuccess } from "@/components/site/AfterSuccess";
import { ApiStatusDot } from "@/components/site/ApiStatusDot";
import { Disclaimer } from "@/components/site/Disclaimer";
import {
  Reveal,
  SectionIndex,
  SignalPipeline,
  SpotlightSurface,
} from "@/components/site/MotionPrimitives";
import { WelcomeModal } from "@/components/site/WelcomeModal";
import { Button } from "@/components/ui/button";
import { siteConfig, buildPageSeo } from "@/config/site";

export const Route = createFileRoute("/")({
  head: () =>
    buildPageSeo({
      title: siteConfig.title,
      description: siteConfig.description,
      path: "/",
    }),
  component: Home,
});

const checklist = [
  {
    num: "01",
    icon: "fa-solid fa-envelope",
    title: "Email Aktif",
    text: "Email aktif yang bisa menerima pesan masuk di HP atau laptop kamu.",
  },
  {
    num: "02",
    icon: "fa-solid fa-inbox",
    title: "Akses Inbox & Spam",
    text: "Akses langsung ke aplikasi email tersebut (termasuk folder Spam).",
  },
  {
    num: "03",
    icon: "fa-brands fa-chrome",
    title: "Browser",
    text: "Browser modern seperti Google Chrome atau Safari.",
  },
  {
    num: "04",
    icon: "fa-solid fa-wifi",
    title: "Koneksi Stabil",
    text: "Jaringan internet yang stabil selama proses verifikasi berlangsung.",
  },
];

const quickAnswers = [
  {
    num: "01",
    q: "Website ini apa?",
    a: "Website bantu untuk mengaktifkan Alight Motion Premium lewat link verifikasi yang dikirim ke email kamu.",
  },
  {
    num: "02",
    q: "Apakah gratis?",
    a: "Ya. Gratis untuk digunakan dan tidak untuk diperjualbelikan.",
  },
  {
    num: "03",
    q: "Perlu paham coding?",
    a: "Tidak. Kamu tidak perlu memahami coding atau API untuk menggunakan website ini.",
  },
  {
    num: "04",
    q: "Berapa lama prosesnya?",
    a: "Biasanya hanya beberapa menit: masukkan email, buka inbox/spam, salin link, lalu verifikasi.",
  },
];

function Home() {
  return (
    <>
      <WelcomeModal />

      {/* Hero Section */}
      <section className="container-page pt-10 pb-8 sm:pt-16 sm:pb-12">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="animate-fade-up lg:col-span-7">
            <SectionIndex
              index="01"
              label="Layanan Gratis"
              detail="Unofficial · Dibuat oleh Nimzz"
            />

            <h1
              className="mt-4 font-display font-semibold tracking-tight text-foreground"
              style={{ fontSize: "clamp(2.25rem, 4vw, 3.5rem)", lineHeight: 1.1 }}
            >
              Alight Motion Premium Creator
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Gunakan layanan gratis dengan panduan langkah demi langkah yang mudah dipahami, tanpa
              perlu password akun dan tanpa perlu keahlian teknis.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="motion-press gap-2.5 px-6">
                <Link to="/aktivasi">
                  <i className="fa-solid fa-bolt text-xs" aria-hidden="true" />
                  <span>Mulai Aktivasi</span>
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="motion-press gap-2.5 px-5">
                <Link to="/testimoni">
                  <i className="fa-solid fa-vector-square text-xs" aria-hidden="true" />
                  <span>Live Testimoni</span>
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="motion-press gap-2.5 px-5">
                <Link to="/panduan">
                  <i className="fa-solid fa-book-open text-xs" aria-hidden="true" />
                  <span>Baca Panduan</span>
                </Link>
              </Button>
            </div>

            <div className="mt-8 border-t border-border pt-5">
              <ApiStatusDot />
            </div>
          </div>

          <div className="animate-fade-up stagger-2 lg:col-span-5">
            <div className="animate-float-subtle overflow-hidden rounded-2xl border border-border bg-card shadow-lift">
              <img
                src={siteConfig.thumbnail}
                alt="Tampilan ilustrasi aplikasi Alight Motion dengan status premium aktif"
                width={1280}
                height={800}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-[1.03]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sebelum Mulai */}
      <section
        aria-labelledby="before-title"
        className="container-page section-pad border-t border-border"
      >
        <div className="grid items-start gap-8 lg:grid-cols-12">
          <Reveal direction="left" className="lg:col-span-5">
            <SectionIndex index="02" label="Persiapan Awal" />
            <h2 id="before-title" className="mt-2.5 text-2xl font-semibold sm:text-3xl">
              Sebelum Mulai
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Siapkan beberapa hal sederhana ini dulu. Kamu tidak perlu memahami coding atau API
              untuk menggunakan website ini.
            </p>

            <div className="mt-6">
              <SignalPipeline compact />
            </div>
          </Reveal>

          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {checklist.map((item, idx) => (
              <li key={item.num}>
                <Reveal delay={idx * 80} className="h-full">
                  <SpotlightSurface className="h-full p-5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-primary tabular-nums">
                        {item.num}
                      </span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-primary">
                        <i className={`${item.icon} text-xs`} aria-hidden="true" />
                      </div>
                    </div>
                    <h3 className="mt-3.5 text-base font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>
                  </SpotlightSurface>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Penjelasan Singkat */}
      <section
        aria-labelledby="quick-title"
        className="container-page section-pad border-t border-border"
      >
        <Reveal>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <SectionIndex index="03" label="Informasi Dasar" />
              <h2 id="quick-title" className="mt-2.5 text-2xl font-semibold sm:text-3xl">
                Penjelasan Singkat
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm" className="motion-press gap-2">
                <Link to="/troubleshooting">
                  <i className="fa-solid fa-screwdriver-wrench text-xs" aria-hidden="true" />
                  <span>Email tidak masuk?</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="motion-press gap-2">
                <Link to="/status">
                  <i className="fa-solid fa-server text-xs" aria-hidden="true" />
                  <span>Cek API Status</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="motion-press gap-2">
                <Link to="/sistem">
                  <i className="fa-solid fa-gears text-xs" aria-hidden="true" />
                  <span>Tentang Sistem</span>
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {quickAnswers.map((item, idx) => (
            <Reveal key={item.q} delay={idx * 80}>
              <SpotlightSurface className="h-full p-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs font-semibold text-primary tabular-nums">
                    {item.num}.
                  </span>
                  <h3 className="text-base font-semibold text-foreground">{item.q}</h3>
                </div>
                <p className="mt-2 pl-6 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </SpotlightSurface>
            </Reveal>
          ))}
        </div>
      </section>

      <AfterSuccess />
      <Disclaimer />
    </>
  );
}
