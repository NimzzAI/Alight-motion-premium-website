import { Link, createFileRoute } from "@tanstack/react-router";

import { ApiStatusCard } from "@/components/site/ApiStatusCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { absoluteUrl } from "@/config/site";

const description =
  "Solusi untuk email tidak masuk, INVALID_EMAIL, INVALID_OOB_CODE, EXPIRED_OOB_CODE, TOO_MANY_ATTEMPTS, API offline, dan aktivasi gagal.";

export const Route = createFileRoute("/troubleshooting")({
  head: () => ({
    meta: [
      { title: "Mengalami Masalah? — Alight Motion Premium Creator" },
      { name: "description", content: description },
      { property: "og:title", content: "Mengalami Masalah? — Alight Motion Premium Creator" },
      { property: "og:description", content: description },
      { property: "og:url", content: absoluteUrl("/troubleshooting") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/troubleshooting") }],
  }),
  component: TroubleshootingPage,
});

const problems: { title: string; meaning?: string; steps?: string[]; solution?: string }[] = [
  {
    title: "Email tidak masuk",
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
    meaning: "Artinya format email tidak valid.",
    solution: "Pastikan email memiliki format yang benar. Contoh: nama@gmail.com",
  },
  {
    title: "INVALID_OOB_CODE",
    meaning: "Artinya link tidak valid atau sudah tidak dapat digunakan.",
    solution: "Minta link baru melalui proses pengiriman email.",
  },
  {
    title: "EXPIRED_OOB_CODE",
    meaning: "Artinya link sudah kedaluwarsa.",
    solution: "Kirim link baru dan gunakan link tersebut sebelum masa berlakunya habis.",
  },
  {
    title: "TOO_MANY_ATTEMPTS",
    meaning: "Artinya terlalu banyak percobaan dalam waktu tertentu.",
    solution: "Tunggu beberapa saat sebelum mencoba lagi. Jangan melakukan spam request.",
  },
  {
    title: "API Offline",
    meaning: "Artinya server API tidak dapat dihubungi.",
    steps: [
      "Periksa koneksi internet.",
      "Tekan tombol Refresh Status.",
      "Tunggu sampai API kembali online.",
    ],
  },
  {
    title: "Aktivasi gagal",
    meaning:
      "Verifikasi link dan proses aktivasi dapat merupakan dua tahap yang berbeda, jadi link bisa valid walaupun aktivasi belum selesai.",
    solution:
      "Link berhasil diproses, tetapi layanan aktivasi belum berhasil menyelesaikan proses. Coba kembali nanti atau hubungi pengelola layanan.",
  },
];

function TroubleshootingPage() {
  return (
    <section className="container-page pt-12 pb-4">
      <h1 className="text-3xl font-semibold sm:text-4xl">Mengalami Masalah?</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Cari masalah yang kamu alami di daftar berikut, lalu ikuti solusinya.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card px-5">
          {problems.map((problem) => (
            <AccordionItem key={problem.title} value={problem.title}>
              <AccordionTrigger className="text-left text-base">{problem.title}</AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                {problem.meaning && <p>{problem.meaning}</p>}
                {problem.steps && (
                  <ol className="space-y-1.5">
                    {problem.steps.map((step, index) => (
                      <li key={step}>
                        {index + 1}. {step}
                      </li>
                    ))}
                  </ol>
                )}
                {problem.solution && (
                  <p className="rounded-xl border border-border bg-surface p-3.5">
                    {problem.solution}
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="space-y-4">
          <ApiStatusCard />
          <Button asChild variant="outline" className="w-full">
            <Link to="/faq">Baca FAQ</Link>
          </Button>
          <Button asChild className="w-full">
            <Link to="/aktivasi">Coba Aktivasi Lagi</Link>
          </Button>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Website ini tidak pernah menampilkan token, secret, atau credential internal apa pun.
          </p>
        </div>
      </div>
    </section>
  );
}
