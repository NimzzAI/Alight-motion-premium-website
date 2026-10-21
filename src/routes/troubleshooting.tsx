import { Link, createFileRoute } from "@tanstack/react-router";

import { ApiStatusCard } from "@/components/site/ApiStatusCard";
import { Reveal, SectionIndex, SpotlightSurface } from "@/components/site/MotionPrimitives";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { buildPageSeo } from "@/config/site";

const description =
  "Solusi kendala aktivasi Alight Motion Premium: email tidak masuk, INVALID_EMAIL, INVALID_OOB_CODE, EXPIRED_OOB_CODE, TOO_MANY_ATTEMPTS, dan API offline.";

export const Route = createFileRoute("/troubleshooting")({
  head: () =>
    buildPageSeo({
      title: "Troubleshooting & Solusi Error — Alight Motion Premium Creator",
      description,
      path: "/troubleshooting",
    }),
  component: TroubleshootingPage,
});

const problems: {
  title: string;
  icon: string;
  meaning?: string;
  steps?: string[];
  solution?: string;
}[] = [
  {
    title: "Email tidak masuk",
    icon: "fa-solid fa-envelope",
    steps: [
      "Periksa koneksi internet.",
      "Pastikan email yang kamu masukkan benar.",
      "Periksa folder Spam.",
      "Periksa folder Promotions/Junk.",
      "Tunggu beberapa saat.",
      "Coba kirim ulang jika tombol kirim ulang tersedia.",
    ],
  },
  {
    title: "INVALID_EMAIL",
    icon: "fa-solid fa-at",
    meaning: "Artinya format email tidak valid.",
    solution: "Pastikan email memiliki format yang benar. Contoh: nama@gmail.com",
  },
  {
    title: "INVALID_OOB_CODE",
    icon: "fa-solid fa-link-slash",
    meaning: "Artinya link tidak valid atau sudah tidak dapat digunakan.",
    solution: "Minta link baru melalui proses pengiriman email.",
  },
  {
    title: "EXPIRED_OOB_CODE",
    icon: "fa-regular fa-clock",
    meaning: "Artinya link sudah kedaluwarsa.",
    solution: "Kirim link baru dan gunakan link tersebut sebelum masa berlakunya habis.",
  },
  {
    title: "TOO_MANY_ATTEMPTS",
    icon: "fa-solid fa-gauge-high",
    meaning: "Artinya terlalu banyak percobaan dalam waktu tertentu.",
    solution: "Tunggu beberapa saat sebelum mencoba lagi. Jangan melakukan spam request.",
  },
  {
    title: "API Offline",
    icon: "fa-solid fa-plug-circle-xmark",
    meaning: "Artinya server API tidak dapat dihubungi.",
    steps: [
      "Periksa koneksi internet.",
      "Tekan tombol Refresh Status.",
      "Tunggu sampai API kembali online.",
    ],
  },
  {
    title: "Aktivasi gagal",
    icon: "fa-solid fa-arrows-rotate",
    meaning:
      "Verifikasi link dan proses aktivasi dapat merupakan dua tahap yang berbeda, jadi link bisa valid walaupun aktivasi belum selesai.",
    solution:
      "Link berhasil diproses, tetapi layanan aktivasi belum berhasil menyelesaikan proses. Coba kembali nanti atau hubungi pengelola layanan.",
  },
];

function TroubleshootingPage() {
  return (
    <section className="container-page pt-10 pb-12 sm:pt-14">
      <div className="animate-fade-up border-b border-border pb-6">
        <SectionIndex index="BANTUAN" label="Solusi Kendala Umum" />
        <h1 className="mt-2.5 text-3xl font-semibold sm:text-4xl">Mengalami Masalah?</h1>
        <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Cari masalah yang kamu alami di daftar berikut, lalu ikuti solusinya.
        </p>
      </div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_21rem]">
        <Reveal>
          <SpotlightSurface className="px-6 py-2" interactive={false}>
            <Accordion type="single" collapsible className="w-full">
              {problems.map((problem, index) => (
                <AccordionItem key={problem.title} value={problem.title}>
                  <AccordionTrigger className="py-4 text-left text-sm font-semibold hover:no-underline sm:text-base">
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-xs font-medium text-primary tabular-nums">
                        0{index + 1}
                      </span>
                      <i
                        className={`${problem.icon} w-4 text-center text-xs text-muted-foreground`}
                        aria-hidden="true"
                      />
                      <span>{problem.title}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pb-5 pl-0 text-sm leading-relaxed text-muted-foreground sm:pl-12">
                    {problem.meaning && <p>{problem.meaning}</p>}
                    {problem.steps && (
                      <ol className="space-y-1.5 rounded-xl border border-border bg-surface/50 p-4">
                        {problem.steps.map((step, idx) => (
                          <li key={step}>
                            {idx + 1}. {step}
                          </li>
                        ))}
                      </ol>
                    )}
                    {problem.solution && (
                      <p className="rounded-xl border border-border bg-surface p-3.5 text-foreground">
                        {problem.solution}
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </SpotlightSurface>
        </Reveal>

        <Reveal delay={120} className="space-y-4">
          <ApiStatusCard />

          <div className="grid grid-cols-2 gap-2.5">
            <Button asChild variant="outline" className="motion-press w-full gap-2 text-xs">
              <Link to="/faq">
                <i className="fa-solid fa-circle-question text-xs" aria-hidden="true" />
                <span>Baca FAQ</span>
              </Link>
            </Button>
            <Button asChild className="motion-press w-full gap-2 text-xs">
              <Link to="/aktivasi">
                <i className="fa-solid fa-bolt text-xs" aria-hidden="true" />
                <span>Coba Aktivasi Lagi</span>
              </Link>
            </Button>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Website ini tidak pernah menampilkan token, secret, atau credential internal apa pun.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
