import { Link, createFileRoute } from "@tanstack/react-router";

import { AfterSuccess } from "@/components/site/AfterSuccess";
import { Button } from "@/components/ui/button";

const description =
  "Panduan lengkap step-by-step untuk pemula: dari memasukkan email sampai verifikasi magic link.";

export const Route = createFileRoute("/panduan")({
  head: () => ({
    meta: [
      { title: "Panduan Lengkap — Alight Motion Premium Creator" },
      { name: "description", content: description },
      { property: "og:title", content: "Panduan Lengkap — Alight Motion Premium Creator" },
      { property: "og:description", content: description },
      { property: "og:url", content: "/panduan" },
    ],
    links: [{ rel: "canonical", href: "/panduan" }],
  }),
  component: PanduanPage,
});

type Step = {
  title: string;
  intro: string;
  items?: string[];
  note?: string;
  diagram?: string;
};

const steps: Step[] = [
  {
    title: "Masukkan Email",
    intro: "Masukkan email yang ingin kamu gunakan pada kolom email.",
    note: "Gunakan email yang benar-benar bisa kamu akses karena link akan dikirim ke email tersebut.",
  },
  {
    title: "Kirim Link",
    intro:
      "Tekan tombol Kirim Link. Website akan meneruskan permintaan ke layanan, lalu email dikirim ke alamat kamu. Selama proses berjalan, tombol menampilkan status loading.",
    diagram: "Email\n ↓\nWebsite\n ↓\nAPI\n ↓\nEmail dikirim",
    note: "Jika berhasil, akan muncul pesan: “Link berhasil dikirim. Sekarang buka inbox email kamu.”",
  },
  {
    title: "Cek Email",
    intro: "Buka email kamu dan cari email dari layanan ini.",
    items: [
      "Buka aplikasi Gmail atau email provider kamu.",
      "Cari email yang berhubungan dengan layanan.",
      "Jika tidak menemukan email, periksa Inbox, Spam, Promotions, dan Junk.",
      "Tunggu beberapa saat jika email belum muncul.",
    ],
    note: "Sudah menemukan emailnya? Tekan tombol “Email Sudah Ditemukan” pada halaman Aktivasi.",
  },
  {
    title: "Salin Magic Link",
    intro: "Magic link adalah link khusus yang dikirim melalui email untuk proses verifikasi.",
    items: [
      "Buka email.",
      "Cari link verifikasi.",
      "Salin link tersebut.",
      "Jangan membagikan link kepada orang lain.",
    ],
    note: "Jangan membagikan magic link atau informasi akun kepada orang lain.",
  },
  {
    title: "Masukkan Magic Link",
    intro:
      "Pada halaman Aktivasi tersedia dua kolom: Email dan Magic Link. Paste link yang tadi kamu salin ke kolom Magic Link.",
    note: "Pastikan link disalin utuh, tanpa ada karakter yang terpotong.",
  },
  {
    title: "Verifikasi",
    intro:
      "Tekan Verifikasi & Aktivasi. Website akan menampilkan status “Memeriksa link...” lalu “Memproses verifikasi...”. Jika berhasil, muncul pesan Verifikasi berhasil dan hasil aktivasi kamu ditampilkan.",
  },
];

function PanduanPage() {
  return (
    <>
      <section className="container-page pt-12">
        <h1 className="text-3xl font-semibold sm:text-4xl">Panduan Lengkap</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Panduan ini ditulis untuk pemula. Cukup ikuti nomornya dari atas ke bawah.
        </p>

        <ol className="mt-10 space-y-6">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8"
            >
              <div className="flex flex-col gap-6 sm:flex-row">
                <span className="font-display text-4xl leading-none font-semibold text-primary/30 sm:text-5xl">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">
                    Step {index + 1} — {step.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.intro}</p>

                  {step.items && (
                    <ol className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                      {step.items.map((item, itemIndex) => (
                        <li key={item}>
                          {itemIndex + 1}. {item}
                        </li>
                      ))}
                    </ol>
                  )}

                  {step.diagram && (
                    <pre className="mt-4 rounded-xl border border-border bg-surface p-4 font-sans text-sm leading-relaxed text-muted-foreground">
                      {step.diagram}
                    </pre>
                  )}

                  {index === 0 && (
                    <div className="mt-4 rounded-xl border border-dashed border-border bg-surface p-4">
                      <p className="text-xs text-muted-foreground">
                        Ilustrasi posisi form: kolom Email berada di bagian atas kartu Step 1 pada
                        halaman Aktivasi.
                      </p>
                      <div className="mt-3 space-y-2">
                        <div className="h-3 w-20 rounded bg-border" />
                        <div className="h-9 rounded-lg border border-border bg-card" />
                        <div className="h-9 w-40 rounded-lg bg-primary/20" />
                      </div>
                    </div>
                  )}

                  {step.note && (
                    <p className="mt-4 flex gap-2.5 rounded-xl border border-warning/40 bg-warning/10 p-3.5 text-sm leading-relaxed text-warning-foreground">
                      <i
                        className="fa-solid fa-triangle-exclamation mt-0.5 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{step.note}</span>
                    </p>
                  )}

                  {index < steps.length - 1 && (
                    <Button asChild variant="outline" size="sm" className="mt-5">
                      <Link to="/aktivasi">
                        Lanjut ke Step {index + 2}
                        <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8">
          <Button asChild size="lg">
            <Link to="/aktivasi">Mulai Aktivasi Sekarang</Link>
          </Button>
        </div>
      </section>

      <AfterSuccess />
    </>
  );
}
