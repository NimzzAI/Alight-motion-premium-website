export function Disclaimer() {
  return (
    <section aria-labelledby="disclaimer-title" className="container-page section-pad">
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 id="disclaimer-title" className="flex items-center gap-2 text-lg font-semibold">
          <i className="fa-solid fa-circle-info text-muted-foreground" aria-hidden="true" />
          Disclaimer
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Website ini merupakan layanan unofficial yang dibuat oleh Nimzz dan bukan merupakan
            website resmi Alight Motion atau Alight Creative.
          </p>
          <p>Layanan disediakan secara gratis dan tidak untuk diperjualbelikan.</p>
          <p>
            Ketersediaan layanan bergantung pada API dan layanan pihak ketiga yang digunakan. Sistem
            dapat berubah atau berhenti berfungsi sewaktu-waktu.
          </p>
        </div>
      </div>
    </section>
  );
}
