import { Reveal, SectionIndex, SpotlightSurface } from "@/components/site/MotionPrimitives";

const steps = [
  {
    title: "Gunakan Email yang Sama",
    desc: "Pastikan menggunakan akun/email yang sama seperti yang kamu masukkan di website ini.",
    icon: "fa-solid fa-envelope",
  },
  {
    title: "Buka Alight Motion",
    desc: "Buka aplikasi Alight Motion di HP kamu.",
    icon: "fa-solid fa-mobile-screen-button",
  },
  {
    title: "Login Akun",
    desc: "Login menggunakan metode akun/email yang sesuai.",
    icon: "fa-solid fa-right-to-bracket",
  },
  {
    title: "Cek Status Membership",
    desc: "Periksa status membership/premium pada profil aplikasi.",
    icon: "fa-solid fa-award",
  },
  {
    title: "Muat Ulang Jika Perlu",
    desc: "Jika status belum berubah, tunggu beberapa saat dan periksa kembali.",
    icon: "fa-solid fa-arrows-rotate",
  },
];

export function AfterSuccess() {
  return (
    <section
      aria-labelledby="after-title"
      className="container-page section-pad border-t border-border"
    >
      <Reveal>
        <div className="max-w-2xl">
          <SectionIndex index="04" label="Langkah Berikutnya" />
          <h2 id="after-title" className="mt-2.5 text-2xl font-semibold sm:text-3xl">
            Setelah Aktivasi Berhasil
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
            Berikut langkah umum berikutnya agar kamu bisa menggunakan akun secara resmi pada
            aplikasi Alight Motion.
          </p>
        </div>
      </Reveal>

      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((step, index) => (
          <li key={step.title} className="h-full">
            <Reveal delay={index * 70} className="h-full">
              <SpotlightSurface className="flex h-full flex-col justify-between p-5">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-primary tabular-nums">
                      0{index + 1}
                    </span>
                    <i
                      className={`${step.icon} text-sm text-muted-foreground`}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
              </SpotlightSurface>
            </Reveal>
          </li>
        ))}
      </ol>

      <Reveal delay={200}>
        <div className="mt-6 flex items-center gap-2.5 text-xs text-muted-foreground">
          <i className="fa-solid fa-lock text-primary" aria-hidden="true" />
          <span>
            Layanan ini tidak akan pernah meminta password, token, atau credential apa pun dari
            kamu.
          </span>
        </div>
      </Reveal>
    </section>
  );
}
