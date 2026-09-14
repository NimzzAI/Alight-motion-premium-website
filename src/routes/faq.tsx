import { createFileRoute } from "@tanstack/react-router";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { absoluteUrl } from "@/config/site";

const description =
  "Pertanyaan yang sering ditanyakan tentang Alight Motion Premium Creator: gratis, unofficial, magic link, dan status API.";

const faqs = [
  {
    q: "Apakah layanan ini gratis?",
    a: "Ya, website ini dirancang sebagai layanan gratis dan tidak untuk diperjualbelikan.",
  },
  {
    q: "Apakah ini website resmi Alight Motion?",
    a: "Tidak. Ini adalah layanan unofficial yang dibuat oleh Nimzz.",
  },
  { q: "Apakah harus bisa coding?", a: "Tidak. User cukup mengikuti panduan." },
  { q: "Apa itu magic link?", a: "Link verifikasi yang dikirim melalui email." },
  {
    q: "Kenapa email tidak masuk?",
    a: "Periksa Spam, Promotions, Junk, dan pastikan alamat email benar.",
  },
  {
    q: "Apakah magic link boleh dibagikan?",
    a: "Tidak. Jangan membagikan link verifikasi atau credential kepada orang lain.",
  },
  {
    q: "Bagaimana mengetahui API sedang online?",
    a: "Gunakan indikator API Status pada website.",
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
    <section className="container-page pt-12">
      <h1 className="text-3xl font-semibold sm:text-4xl">FAQ</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Pertanyaan yang paling sering ditanyakan pengguna baru.
      </p>

      <Accordion
        type="single"
        collapsible
        className="mt-8 rounded-2xl border border-border bg-card px-5"
      >
        {faqs.map((faq) => (
          <AccordionItem key={faq.q} value={faq.q}>
            <AccordionTrigger className="text-left text-base">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
