import { Link, createFileRoute } from "@tanstack/react-router";

import { AfterSuccess } from "@/components/site/AfterSuccess";
import {
  Reveal,
  SectionIndex,
  SignalPipeline,
  SpotlightSurface,
} from "@/components/site/MotionPrimitives";
import { Button } from "@/components/ui/button";
import { absoluteUrl, buildPageSeo } from "@/config/site";

const description =
  "Panduan lengkap step-by-step untuk pemula: dari memasukkan email, memeriksa folder Spam, menyalin URL Magic Link, hingga verifikasi Alight Motion Pro.";

export const Route = createFileRoute("/panduan")({
  head: () => {
    const seo = buildPageSeo({
      title: "Panduan Lengkap — Alight Motion Premium Creator",
      description,
      path: "/panduan",
      ogType: "article",
    });
    return {
      ...seo,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "Cara Aktivasi Alight Motion Premium via Magic Link",
            description,
            totalTime: "PT3M",
            step: steps.map((step, index) => ({
              "@type": "HowToStep",
              position: index + 1,
              name: step.title,
              text: step.intro,
              url: `${absoluteUrl("/panduan")}#step-${index + 1}`,
            })),
          }),
        },
      ],
    };
  },
  component: PanduanPage,
});

type StepImage = { src: string; caption: string };

type Step = {
  title: string;
  icon: string;
  intro: string;
  items?: string[];
  note?: string;
  showPipeline?: boolean;
  images?: StepImage[];
};

const steps: Step[] = [
  {
    title: "Masukkan Email",
    icon: "fa-solid fa-envelope",
    intro: "Masukkan email yang ingin kamu gunakan pada kolom email.",
    note: "Gunakan email yang benar-benar bisa kamu akses karena link akan dikirim ke email tersebut.",
  },
  {
    title: "Kirim Link",
    icon: "fa-solid fa-paper-plane",
    intro:
      "Tekan tombol Kirim Link. Website akan meneruskan permintaan ke layanan, lalu email dikirim ke alamat kamu. Selama proses berjalan, tombol menampilkan status loading.",
    showPipeline: true,
    note: "Jika berhasil, akan muncul pesan: “Link berhasil dikirim. Sekarang buka inbox email kamu.”",
  },
  {
    title: "Cek Email",
    icon: "fa-solid fa-inbox",
    intro: "Buka email kamu dan cari email dari layanan ini.",
    items: [
      "Buka aplikasi Gmail atau email provider kamu.",
      "Cari email yang berhubungan dengan layanan.",
      "Jika tidak menemukan email, periksa Inbox, Spam, Promotions, dan Junk.",
      "Tunggu beberapa saat jika email belum muncul.",
    ],
    images: [
      { src: "/images/panduan/01-buka-gmail.jpg", caption: "1. Buka aplikasi Gmail di HP kamu." },
      {
        src: "/images/panduan/02-menu-spam.jpg",
        caption: "2. Pencet ikon tiga garis (menu) di pojok kiri atas.",
      },
      {
        src: "/images/panduan/03-pilih-spam.jpg",
        caption: "3. Pilih folder “Spam” — email verifikasi sering masuk sini, bukan Inbox utama.",
      },
    ],
    note: "Sudah menemukan emailnya? Tekan tombol “Email Sudah Ditemukan” pada halaman Aktivasi.",
  },
  {
    title: "Salin Magic Link",
    icon: "fa-solid fa-link",
    intro: "Magic link adalah link khusus yang dikirim melalui email untuk proses verifikasi.",
    items: [
      "Buka email dari noreply@alight-creative.firebaseapp.com.",
      "Cari tulisan biru “Sign in to Alight Creative” di dalam email.",
      "JANGAN pencet tulisan itu langsung. Tahan/tap-lama sampai muncul menu popup.",
      "Pilih “Salin URL” dari menu popup yang muncul.",
      "Jangan membagikan link kepada orang lain.",
    ],
    images: [
      {
        src: "/images/panduan/04-buka-email.jpg",
        caption: "4. Buka email, cari tulisan “Sign in to Alight Creative”. Jangan dipencet dulu.",
      },
      {
        src: "/images/panduan/05-salin-url.jpg",
        caption: "5. Tahan tulisan itu sampai muncul menu, lalu pilih “Salin URL”.",
      },
    ],
    note: "Jangan membagikan magic link atau informasi akun kepada orang lain.",
  },
  {
    title: "Masukkan Magic Link",
    icon: "fa-regular fa-clipboard",
    intro:
      "Pada halaman Aktivasi tersedia dua kolom: Email dan Magic Link. Paste link yang tadi kamu salin ke kolom Magic Link.",
    note: "Pastikan link disalin utuh, tanpa ada karakter yang terpotong.",
  },
  {
    title: "Verifikasi",
    icon: "fa-solid fa-shield-halved",
    intro:
      "Tekan Verifikasi & Aktivasi. Website akan menampilkan status “Memeriksa link...” lalu “Memproses verifikasi...”. Jika berhasil, muncul pesan Verifikasi berhasil dan hasil aktivasi kamu ditampilkan.",
  },
];

function PanduanPage() {
  return (
    <>
      <section className="container-page pt-10 pb-8 sm:pt-14">
        <div className="animate-fade-up flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <SectionIndex index="PANDUAN" label="Langkah demi Langkah" detail="6 Tahap" />
            <h1 className="mt-2.5 text-3xl font-semibold sm:text-4xl">Panduan Lengkap</h1>
            <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Panduan ini ditulis untuk pemula. Cukup ikuti nomornya dari atas ke bawah.
            </p>
          </div>
          <Button asChild className="motion-press gap-2">
            <Link to="/aktivasi">
              <i className="fa-solid fa-bolt text-xs" aria-hidden="true" />
              <span>Mulai Aktivasi</span>
            </Link>
          </Button>
        </div>

        <ol className="mt-10 space-y-6">
          {steps.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={index * 60}>
                <SpotlightSurface className="p-6 sm:p-8" interactive={false}>
                  <div className="grid gap-6 lg:grid-cols-[8rem_1fr]">
                    <div className="flex items-center justify-between border-b border-border pb-3 lg:flex-col lg:items-start lg:justify-start lg:border-r lg:border-b-0 lg:pr-6 lg:pb-0">
                      <span className="font-mono text-3xl font-semibold text-primary tabular-nums sm:text-4xl">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="mt-0 inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground lg:mt-3">
                        <i className={`${step.icon} text-primary`} aria-hidden="true" />
                        <span>Step {index + 1}</span>
                      </span>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold text-foreground">
                        Step {index + 1} — {step.title}
                      </h2>
                      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                        {step.intro}
                      </p>

                      {step.items && (
                        <ol className="mt-4 space-y-2 rounded-xl border border-border bg-surface/50 p-4 text-sm leading-relaxed text-muted-foreground">
                          {step.items.map((item, itemIndex) => (
                            <li key={item}>
                              {itemIndex + 1}. {item}
                            </li>
                          ))}
                        </ol>
                      )}

                      {step.images && (
                        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                          {step.images.map((img) => (
                            <figure
                              key={img.src}
                              className="overflow-hidden rounded-xl border border-border bg-surface"
                            >
                              <img
                                src={img.src}
                                alt={img.caption}
                                referrerPolicy="no-referrer"
                                className="w-full object-cover transition-transform duration-500 ease-out hover:scale-[1.03]"
                                loading="lazy"
                              />
                              <figcaption className="border-t border-border p-3 text-xs leading-snug text-muted-foreground">
                                {img.caption}
                              </figcaption>
                            </figure>
                          ))}
                        </div>
                      )}

                      {step.showPipeline && (
                        <div className="mt-5">
                          <SignalPipeline compact />
                        </div>
                      )}

                      {step.note && (
                        <div className="mt-5 flex gap-3 rounded-xl border border-warning/35 bg-warning/8 p-3.5 text-xs leading-relaxed text-warning-foreground sm:text-sm">
                          <i
                            className="fa-solid fa-triangle-exclamation mt-0.5 shrink-0 text-warning"
                            aria-hidden="true"
                          />
                          <span>{step.note}</span>
                        </div>
                      )}

                      {index < steps.length - 1 && (
                        <div className="mt-5">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="motion-press gap-2"
                          >
                            <Link to="/aktivasi">
                              <span>Lanjut ke Step {index + 2}</span>
                              <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </SpotlightSurface>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal className="mt-8">
          <Button asChild size="lg" className="motion-press gap-2">
            <Link to="/aktivasi">
              <i className="fa-solid fa-bolt text-xs" aria-hidden="true" />
              <span>Mulai Aktivasi Sekarang</span>
            </Link>
          </Button>
        </Reveal>
      </section>

      <AfterSuccess />
    </>
  );
}
