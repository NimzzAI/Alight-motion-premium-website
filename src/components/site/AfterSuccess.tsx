const steps = [
  "Pastikan menggunakan akun/email yang sama seperti yang kamu masukkan di website ini.",
  "Buka aplikasi Alight Motion.",
  "Login menggunakan metode akun yang sesuai.",
  "Periksa status membership/premium pada aplikasi.",
  "Jika status belum berubah, tunggu beberapa saat dan periksa kembali.",
];

export function AfterSuccess() {
  return (
    <section aria-labelledby="after-title" className="container-page section-pad">
      <h2 id="after-title" className="text-2xl font-semibold sm:text-3xl">
        Setelah Aktivasi Berhasil
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Berikut langkah umum berikutnya agar kamu bisa menggunakan akun secara resmi pada aplikasi
        Alight Motion.
      </p>

      <ol className="mt-6 grid gap-3 sm:grid-cols-2">
        {steps.map((step, index) => (
          <li
            key={step}
            className="flex gap-3 rounded-xl border border-border bg-card p-4 text-sm leading-relaxed"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
              {index + 1}
            </span>
            <span className="text-muted-foreground">{step}</span>
          </li>
        ))}
      </ol>

      <p className="mt-5 text-sm text-muted-foreground">
        Layanan ini tidak akan pernah meminta password, token, atau credential apa pun dari kamu.
      </p>
    </section>
  );
}
