import { Link, createFileRoute } from "@tanstack/react-router";

import { SectionIndex, SpotlightSurface } from "@/components/site/MotionPrimitives";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { absoluteUrl } from "@/config/site";

const description =
  "Pertanyaan yang sering ditanyakan tentang Alight Motion Premium Creator: gratis, unofficial, magic link, dan status API.";

const faqs = [
  {
    q: "Apakah layanan ini gratis?",
    a: "Ya, website ini dirancang sepenuhnya sebagai layanan gratis untuk komunitas dan dilarang keras untuk diperjualbelikan.",
  },
  {
    q: "Apakah ini website resmi Alight Motion?",
    a: "Tidak. Ini adalah utilitas komunitas independen (unofficial) yang dibuat dan dikelola oleh Nimzz.",
  },
  {
    q: "Apakah harus paham coding atau teknis?",
    a: "Tidak perlu. Kamu cukup mengikuti alur 5 langkah terpandu mulai dari memasukkan alamat email hingga menempelkan tautan verifikasi.",
  },
  {
    q: "Apa itu Magic Link?",
    a: "Magic Link adalah tautan masuk khusus sekali pakai yang dikirim melalui email oleh sistem untuk memverifikasi dan mengaktifkan status akun kamu.",
  },
  {
    q: "Kenapa email verifikasi tidak muncul di kotak masuk?",
    a: "Sebagian besar pesan verifikasi otomatis diarahkan oleh Gmail ke folder Spam, Promotions, atau Updates. Pastikan kamu memeriksa folder Spam terlebih dahulu.",
  },
  {
    q: "Apakah Magic Link boleh dibagikan ke orang lain?",
    a: "Tidak boleh. Tautan verifikasi bersifat rahasia untuk akun kamu sendiri dan hanya berlaku selama 5 menit untuk satu kali penggunaan.",
  },
  {
    q: "Bagaimana cara mengetahui server API sedang aktif?",
    a: "Kamu dapat melihat indikator Gateway API di halaman Beranda, Aktivasi, atau membuka halaman Status untuk melihat rincian waktu aktif server.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Alight Motion Premium Creator" },
      { name: "description", content: description },
      { property: "og:title", content: "FAQ — Alight Motion Premium Creator" },
      { property: "og:description", content: description },
      { property: "og:url", content: absoluteUrl("/faq") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/faq") }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <section className="container-page pt-10 pb-12 sm:pt-14">
      <div className="animate-fade-up flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <SectionIndex
            index="TANYA JAWAB"
            label="Pertanyaan yang Sering Diajukan"
            detail="7 Topik Utama"
          />
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Pertanyaan Umum (FAQ)</h1>
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Jawaban ringkas untuk pertanyaan yang paling sering diajukan oleh pengguna baru sebelum
            memulai proses aktivasi.
          </p>
        </div>

        <Button asChild variant="outline" className="motion-press gap-2">
          <Link to="/troubleshooting">
            <i className="fa-solid fa-screwdriver-wrench text-xs" aria-hidden="true" />
            <span>Lihat Solusi Error</span>
          </Link>
        </Button>
      </div>

      <SpotlightSurface className="animate-fade-up stagger-1 mt-8 px-6 py-2" interactive={false}>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.q} value={faq.q}>
              <AccordionTrigger className="py-4 text-left text-sm font-semibold hover:no-underline sm:text-base">
                <span className="flex items-center gap-3.5">
                  <span className="font-mono text-xs font-semibold text-primary tabular-nums">
                    0{index + 1}
                  </span>
                  <span>{faq.q}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-5 pl-7 text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </SpotlightSurface>
    </section>
  );
}
